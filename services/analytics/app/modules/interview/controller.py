import warnings
warnings.filterwarnings('ignore', category=UserWarning, module='tensorflow')
import os 
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import logging
logging.getLogger('absl').setLevel(logging.ERROR)
from app.modules.interview.utils.models import models_dict
from app.modules.interview.utils.helper import extract_faces_from_frames
from app.modules.interview.utils.video import eyebrow,detect_blinks,detect_yawns,detect_smiles
from app.modules.interview.utils.valence_arousal import va_predict
from app.modules.interview.utils.fer import fer_predict,plot_fer_graph
from app.modules.interview.utils.helper import plot_facial_expression_graphs
from app.modules.interview.utils.audio import extract_audio_features
from moviepy.editor import VideoFileClip
import json 
import pandas as pd 
from typing import Callable
import traceback
from app.utils.api import InterviewAPI
import shutil
import time

asrmodel=models_dict['asrmodel']
asrproc=models_dict['asrproc']
sentipipe=models_dict['sentipipe']
valence_arousal_model=models_dict['valence_fer'][1]
val_ar_feat_model=models_dict['valence_fer'][0]
fer_model=models_dict['fer']
smile_cascade=models_dict['smile_cascade']
dnn_net=models_dict['face'][0]
predictor=models_dict['face'][1]
gem_model=models_dict['gem']
fps=30
session_data={}
calibration={}

def analyze_interview(video_path: str, uid: str, user_id: str, count: int, final: bool, test: bool, question_id: str, log: Callable[[str], None]):
		try:
				global session_data
				global calibration
				if uid not in session_data:
						session_data[uid]={
								"vcount":[],
								"duration":[],      
								"audio":[],
								"pitches":[],
								"blinks":[],
								"yawn":[],
								"smile":[],
								"eyebrow":[],
								"fer": [],
								"valence":[],
								"arousal":[],
								"stress":[],
								"sentiment":[],
								"processed_videos":[]
						}
			 
				log(f"Analyzing video for question - {count}")

				output_dir = os.path.join('/tmp/output', uid)
				api = InterviewAPI(uid, user_id, output_dir)
				
				folder_path=os.path.join(output_dir,f'{count}')
				os.makedirs(folder_path,exist_ok=True)
				meta_data_path=os.path.join(folder_path,'metadata.json')
				valence_plot=os.path.join(folder_path,"vas.png")
				ratio_plot=os.path.join(folder_path,"ratio.png")
				word_cloud=os.path.join(folder_path,'wordcloud.jpg')
				valence_combined_plot=os.path.join(output_dir,"vas_combined.png")
				ratio_combined_plot=os.path.join(output_dir,"ratio_combined.png")
				pdf_filename = os.path.join(folder_path,"formatted_output_with_plots.pdf")

				video_clip=VideoFileClip(video_path)
				video_clip=video_clip.set_fps(fps)
				duration=video_clip.duration
				session_data[uid]['vcount'].append(count)
				session_data[uid]['duration'].append(duration)
				audio=video_clip.audio
				audio_path = os.path.join(folder_path,'extracted_audio.wav')
				audio.write_audiofile(audio_path)
				video_frames=[frame for frame in video_clip.iter_frames()]
				faces, landmarks, sizes=extract_faces_from_frames(video_frames,dnn_net,predictor)


				# faces=[extract_face(frame) for frame in tqdm(video_frames)]
				af,pitches=extract_audio_features(audio_path,asrmodel,asrproc,sentipipe,duration,word_cloud,gem_model)
				pitches=[float(pitch) for pitch in pitches]


				fer_emotions,class_wise_frame_count,em_tensors=fer_predict(faces,fps,fer_model)
				valence_list,arousal_list=va_predict(valence_arousal_model,val_ar_feat_model,faces,list(em_tensors))

				timestamps=[j/fps for j in range(len(valence_list))]

				eyebrow_dist=eyebrow(landmarks,sizes)

				blinks,blink_count, ear_ratios=detect_blinks(landmarks,sizes,fps)
				ear_ratios=[float(pitch) for pitch in ear_ratios]

				smiles, smile_ratios, total_smiles, smile_durations,smile_threshold=detect_smiles(landmarks,sizes)
				smile_ratios=[float(smile) for smile in smile_ratios]

				yawns, yawn_ratios, total_yawns, yawn_durations=detect_yawns(landmarks,sizes)

				thresholds=[smile_threshold,0.225,0.22]
				
				plot_facial_expression_graphs(smile_ratios, ear_ratios, yawn_ratios, thresholds, full_path=ratio_plot)

				y_vals = [valence_list, arousal_list,eyebrow_dist,pitches]
				labels = ['Valence', 'Arousal',"EyeBrowDistance","Pitch"]
				
				plot_fer_graph(timestamps, y_vals, labels, full_path=valence_plot)

				meta_data={}
				meta_data['duration']=duration
				meta_data['facial_emotion_recognition'] = {
					"class_wise_frame_count": class_wise_frame_count,
				}
				meta_data['audio']=af

				with open(meta_data_path, 'w') as json_file:
						json.dump(meta_data, json_file, indent=4)

				session_data[uid]['audio'].append(af)
				session_data[uid]['pitches'].append(pitches)
				session_data[uid]['fer'].append(fer_emotions)
				session_data[uid]['valence'].append(valence_list)
				session_data[uid]['arousal'].append(arousal_list)
				session_data[uid]['eyebrow'].append(eyebrow_dist)
				session_data[uid]['smile'].append(smile_ratios)
				session_data[uid]['blinks'].append(ear_ratios)
				session_data[uid]['yawn'].append(yawn_ratios)
				session_data[uid]['sentiment'].append(af['sentiment'][0]['label'])
				if count==1:
						try:	
								filtered_val=[item for item in valence_list if isinstance(item, (int,float))]
								filtered_aro=[item for item in arousal_list if isinstance(item, (int,float))]
								calibration_valence=sum(filtered_val)/len(valence_list)
								calibration_arousal=sum(filtered_aro)/len(arousal_list)
								calibration_pitch=sum(pitches)/len(pitches)
								calibration_eyebrow=sum(eyebrow_dist)/len(eyebrow_dist)
						except:
								calibration_arousal=0
								calibration_valence=0
								calibration_pitch=0
								calibration_eyebrow=0
						calibration['valence']=calibration_valence
						calibration['arousal']=calibration_arousal
						calibration['pitch']=calibration_pitch
						calibration['eyebrow']=calibration_eyebrow

				api.update_individual_analytics(valence_plot, ratio_plot, word_cloud, {
					"uid": uid,
					"user_id": user_id,
					"individual": meta_data,
					"count": count,
					"final": final,
					"question_id": question_id
				})

				log(f"Processed Video: {count}")
				
				if not final:
						session_data[uid]['processed_videos'].append(True)
						return
				elif count > 1:
					while len(session_data[uid]['processed_videos'])!=count-1:
						time.sleep(1)
				videos=len(session_data[uid]['vcount'])
				final_score=0
				#combined calculation 
				combined_pdf=os.path.join(output_dir,'combined.pdf')
				transcripts=''
				combined_valence=[]
				combined_arousal=[]
				combined_fer=[]
				combined_pitch=[]
				combined_eyebrow=[]
				combined_blinks=[]
				combined_yawn=[]
				senti_list=[]
				combined_smiles=[]
				vid_index=[]

				for i in range(videos):
						timestamps=[j/fps for j in range(len(session_data[uid]['valence'][i]))]	
						for j in range(len(timestamps)):
								vid_index.append(i+1)
						transcripts+=session_data[uid]['audio'][i]['transcript']
						combined_pitch+=session_data[uid]['pitches'][i]
						combined_arousal+=session_data[uid]['arousal'][i]
						combined_valence+=session_data[uid]['valence'][i]
						combined_fer+=session_data[uid]['fer'][i]
						combined_blinks+=session_data[uid]['blinks'][i]
						combined_eyebrow+=session_data[uid]['eyebrow'][i]
						combined_smiles+=session_data[uid]['smile'][i]
						combined_yawn+=session_data[uid]['yawn'][i]
						senti_list.append(session_data[uid]['sentiment'][i])

				sentiment_scores = {"Positive": 1, "Negative": -1, "Neutral": 0}
				total_score = sum(sentiment_scores[sentiment] for sentiment in senti_list)
				normalized_senti_score = total_score / len(senti_list)
				neg_val=sum([1 for val in combined_valence if isinstance(val, (int, float)) and val<calibration['valence']])/len(combined_valence)
				neg_ar=sum([1 for val in combined_arousal if isinstance(val, (int, float)) and val>calibration['arousal']])/len(combined_arousal)
				neg_ya=sum([1 for val in combined_yawn if val>0.225])/len(combined_yawn)
				neg_sm=sum([1 for val in combined_smiles if val<smile_threshold])/len(combined_smiles)
				avg_sentiment=(neg_ar+neg_val+neg_ya+neg_sm+normalized_senti_score)/5
				y_vals = [combined_valence, combined_arousal,combined_eyebrow,combined_pitch]
				labels = ['Valence', 'Arousal',"EyeBrowDistance","Pitch"]
				plot_fer_graph(timestamps, y_vals, labels, full_path=valence_combined_plot)
				thresholds=[smile_threshold,0.225,0.22]
				plot_facial_expression_graphs(combined_smiles, combined_blinks, combined_yawn, thresholds, full_path=ratio_combined_plot)

				timestamps=[i/fps for i in range(len(combined_arousal))]
				l=len(timestamps)
				df = pd.DataFrame({
					'timestamps':timestamps,
					'video_index': vid_index,  # Add a column for video index
					'fer': combined_fer,
					'valence': combined_valence,
					'arousal': combined_arousal,
					'eyebrow':combined_eyebrow,
					'blinks':combined_blinks,
					'yawn':combined_yawn,
					'smiles':combined_smiles,
					'pitches':combined_pitch[:l]
				})
				df.to_csv(os.path.join(output_dir,'combined_data.csv'), index=False)

				api.update_combined_analytics(valence_combined_plot, ratio_combined_plot, {
					"uid": uid,
					"user_id": user_id,
					"count": count,
					"combined": {
						"avg_sentiment": 1 - avg_sentiment,
					},
					"final": final,
					"question_id": question_id
				})

				api.save_files()

				if final:
					log(f"🎉 Final report is generated - {count}")
					del session_data[uid]
					shutil.rmtree(output_dir)

		except Exception as e:
						error_trace = traceback.format_exc()
						log(f"Error analyzing video: {str(e)}")
						print(error_trace)
						api.save_error({
								"message": str(e),
								"trace": error_trace
						})
						del session_data[uid]
						shutil.rmtree(output_dir)
						
