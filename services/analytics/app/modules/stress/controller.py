import warnings
warnings.filterwarnings('ignore', category=UserWarning, module='tensorflow')
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import logging
logging.getLogger('absl').setLevel(logging.ERROR)
from moviepy.editor import VideoFileClip
import pandas as pd
from tqdm import tqdm
import time
import json
import cv2
import dlib
from collections import Counter
import statistics
import shutil
import asyncio
import traceback
from app.modules.stress.utils.models import models_dict
from app.modules.stress.utils.valence_arousal import va_predict
from app.modules.stress.utils.speech import speech_predict
from app.modules.stress.utils.eye_track import Facetrack, eye_track_predict
from app.modules.stress.utils.fer import extract_face,fer_predict,plot_graph
from app.utils.socket import ConnectionManager
from app.utils.api import StressAPI
from typing import Callable
session_data={}
dnn_net=models_dict['face'][0]
predictor=models_dict['face'][1]
speech_model=models_dict['speech']
valence_dict_path=models_dict['vad'][0]
arousal_dict_path=models_dict['vad'][1]
dominance_dict_path=models_dict['vad'][2]
valence_arousal_model=models_dict['valence_fer'][1]
val_ar_feat_model=models_dict['valence_fer'][0]
fer_model=models_dict['fer']
recognizer=models_dict['recognizer']

def analyze_stress(video_path: str, uid: str, user_id: str, count: int, final: bool, log: Callable[[str], None]):
	try:
		global session_data
		if uid not in session_data:
			session_data[uid] = {
					"vcount":[],
					"duration":[],

					"eye": [],

					"fer": [],
					"valence":[],
					"arousal":[],
					"stress":[],

					"blinks": [],
					"class_wise_frame_counts": [],

					"speech_emotions": [],
					"speech_data":[],
					"word_weights_list": [],
					"prosody":[],

					"calibration":[],
					"calibration_speech":None,
					"processed_videos":[]
			}
		
		log(f"Analyzing video for question - {count}")

		output_dir = os.path.join('/tmp/output', uid)
		if not os.path.exists(output_dir):
				os.makedirs(output_dir)
		folder_path=os.path.join(output_dir,f'{count}')
		os.makedirs(folder_path,exist_ok=True)
		individual_plot=os.path.join(folder_path,"vas.png")
		
		video_clip = VideoFileClip(video_path)
		video_clip = video_clip.set_fps(30)
		speech_interval=3.0
		session_data[uid]['vcount'].append(count)
		session_data[uid]['duration'].append(video_clip.duration)
		fps = video_clip.fps
		audio = video_clip.audio
		audio_path = os.path.join(folder_path,'extracted_audio.wav')
		segment_path = os.path.join(folder_path,'segment.wav')
		audio.write_audiofile(audio_path)
		video_frames = [frame for frame in video_clip.iter_frames()]

		faces=[extract_face(frame,dnn_net,predictor) for frame in tqdm(video_frames)]
	

		##EYE TRACKING
		fc=Facetrack(predictor)
		log(f"Extracting eye features for question - {count}")
		eye_preds,blink_durations,total_blinks=eye_track_predict(fc,faces)
		session_data[uid]['eye'].append(eye_preds)
		session_data[uid]['blinks'].append(blink_durations)


		#FACIAL EXPRESSION RECOGNITION
		log(f"Extracting facial features for question - {count}")
		fer_emotions,class_wise_frame_count,em_tensors=fer_predict(faces,fps,fer_model)
		session_data[uid]['fer'].append(fer_emotions)
		session_data[uid]['class_wise_frame_counts'].append(class_wise_frame_count)

		#VALENCE AROUSAL STRESS
		valence_list,arousal_list,stress_list=va_predict(valence_arousal_model,val_ar_feat_model,faces,list(em_tensors))
		session_data[uid]['valence'].append(valence_list)
		session_data[uid]['arousal'].append(arousal_list)
		session_data[uid]['stress'].append(stress_list)
		timestamps=[j/fps for j in range(len(valence_list))]
		filtered_val=[item for item in valence_list if isinstance(item, (int,float))]
		filtered_aro=[item for item in arousal_list if isinstance(item, (int,float))]
		filtered_stress=[item for item in stress_list if isinstance(item, (int,float))]
		try:	
			calibration_valence=sum(filtered_val)/len(valence_list)
			calibration_arousal=sum(filtered_aro)/len(arousal_list)
			calibration_stress=sum(filtered_stress)/len(stress_list)
		except:
			calibration_arousal=0
			calibration_valence=0
			calibration_stress=0	
		if count==1:
			session_data[uid]['calibration'].append(calibration_valence)
			session_data[uid]['calibration'].append(calibration_arousal)
			session_data[uid]['calibration'].append(calibration_stress)
			calibration_arousal=None
			calibration_valence=None
			calibration_stress=None
		y_vals = [valence_list, arousal_list, stress_list]
		labels = ['Valence', 'Arousal', 'Stress']
		calib_vals = [calibration_valence, calibration_arousal, calibration_stress]
		plot_graph(timestamps, y_vals, labels, individual_plot, calib_vals)


        #SPEECH EMOTION RECOGNITION
		log(f"Extracting speech features for question - {count}")
		emotions,major_emotion,word,prosody_f=speech_predict(audio_path, segment_path,speech_model,valence_dict_path,arousal_dict_path,dominance_dict_path,speech_interval,recognizer)
		session_data[uid]['speech_emotions'].append(emotions)
		session_data[uid]['prosody'].append(prosody_f)
		session_data[uid]['word_weights_list'].append(word['word_weights'])
		session_data[uid]['speech_data'].append([float(word['average_pause_length'] if word and word['average_pause_length'] else 0),float(word['articulation_rate'] if word and word['articulation_rate'] else 0),float(word['speaking_rate'] if word and word['speaking_rate'] else 0)])
		try:
			avg_pitch=sum(prosody_f[0])/len(prosody_f[0])
		except:
			avg_pitch=0
		if count==1:
			try:	
				pitch,rythm,tone=prosody_f
				calibration_pitch=sum(pitch)/len(pitch)
				calibration_rythm=sum(rythm)/len(rythm)
				calibration_tone=sum(tone)/len(tone)
			except:
				calibration_pitch=0
				calibration_rythm=0
				calibration_tone=0
			session_data[uid]['calibration_speech']=[calibration_pitch,calibration_rythm,calibration_tone]

		log(f"Generating the metadata for question - {count}")		
        
		# Create Meta Data
		meta_data={}
		try:
			avg_blink_duration= float(sum(blink_durations)/(len(blink_durations)))
		except:
			avg_blink_duration=0
		meta_data['vcount']=count
		meta_data['eye_emotion_recognition'] = {
			"blink_durations": blink_durations,
			"avg_blink_duration":avg_blink_duration,
			"total_blinks": total_blinks,
			"duration":video_clip.duration
		}
    
		meta_data['facial_emotion_recognition'] = {
			"class_wise_frame_count": class_wise_frame_count,
		}
		meta_data['speech_emotion_recognition'] = {
		'major_emotion':str(major_emotion),
		'pause_length':float(word['average_pause_length']),
		'articulation_rate':float(word['articulation_rate']),
		'speaking_rate':float(word['speaking_rate']),
		'word_weights':word['word_weights'],
		'pitch':avg_pitch
		}

		log(f"✅ Individual metadata for video-{count} has been generated")

		api = StressAPI()

		if not (final and count==1):
			api.send_analytics(individual_plot,{
				"uid": uid,
				"user_id": user_id, 
				"individual": meta_data,
				"count": count
			})

		log(f"Processed Video: {count}")

		if not final:
			session_data[uid]['processed_videos'].append(True)
			return
		elif count > 1:
			while len(session_data[uid]['processed_videos'])!=count-1:
				time.sleep(1) 
	
		# Process combined
		
		log(f"Processing gathered data for final output")
		vcount=session_data[uid]['vcount']
		sorted_indices = sorted(range(len(vcount)), key=lambda i: vcount[i])
		for key in session_data[uid]:
			# Only sort lists that are the same length as vcount
			if len(session_data[uid][key]) == len(vcount):
				session_data[uid][key] = [session_data[uid][key][i] for i in sorted_indices]

		videos=len(session_data[uid]['vcount'])
		#INDIV PLOT SAVING
		combined_speech=[]
		combined_valence=[]
		combined_arousal=[]
		combined_stress=[]
		combined_fer=[]
		combined_eye=[]
		vid_index=[]
		combined_speech=[]
		combined_blinks=[]
		combined_pitch = []
		combined_rhythm = []
		combined_tone = []

		# Iterate through each prosody_f list
		for prosody_f in session_data[uid]['prosody']:
			combined_pitch.extend(prosody_f[0])  # Combine pitch
			combined_rhythm.extend(prosody_f[1])  # Combine rhythm
			combined_tone.extend(prosody_f[2])  # Combine tone
		try:
			comb_avg_pitch=sum(combined_pitch)/len(combined_pitch)
		except:
			comb_avg_pitch=0
		calib_pitch,calib_rhythm,calib_tone=session_data[uid]['calibration_speech']
		adjusted_pitch = [p - calib_pitch	 for p in combined_pitch]
		adjusted_rhythm = [r - calib_rhythm for r in combined_rhythm]
		adjusted_tone = [t - calib_tone for t in combined_tone]

		for i in range(videos):
			for j in range(len(session_data[uid]['speech_emotions'][i])):
				vid_index.append(i+1)
			combined_speech+=session_data[uid]['speech_emotions'][i]
		timestamps=[i*speech_interval for i in range(len(combined_speech))]
		df = pd.DataFrame({
			'timestamps':timestamps,
			'video_index':vid_index,
			'speech_emotion':combined_speech,
			'pitch':combined_pitch,
			'calib_pitch':adjusted_pitch,
			'rhythm':combined_rhythm,
			'calib_rhythm':adjusted_rhythm,
			'tone':combined_tone,
			'calib_tone':adjusted_tone,
		})
		df.to_csv(os.path.join(output_dir,'combined_speech.csv'), index=False)

		vid_index=[]
		for i in range(videos):
			timestamps=[j/fps for j in range(len(session_data[uid]['valence'][i]))]			
			for j in range(len(timestamps)):
				vid_index.append(i+1)
			combined_arousal+=session_data[uid]['arousal'][i]
			combined_valence+=session_data[uid]['valence'][i]
			combined_stress+=session_data[uid]['stress'][i]
			combined_fer+=session_data[uid]['fer'][i]
			combined_blinks+=session_data[uid]['blinks'][i]
			# combined_class_wise_frame_count+=session_data[uid]['class_wise_frame_counts'][i]
			try:
				max_value=max([x for x in combined_eye if isinstance(x, (int, float))])
			except:
				max_value=0
			session_data[uid]['eye'][i]=[x + max_value if isinstance(x, (int, float)) else x for x in session_data[uid]['eye'][i]]
			combined_eye+=session_data[uid]['eye'][i]
		
		timestamps=[i/fps for i in range(len(combined_arousal))]
		combined_plot=os.path.join(output_dir,'combined_vas.png')

		

		df = pd.DataFrame({
			'timestamps':timestamps,
			'video_index': vid_index,  # Add a column for video index
			'fer': combined_fer,
			'valence': combined_valence,
			'arousal': combined_arousal,
			'stress': combined_stress,
			'eye': combined_eye,
		})
		calibration_valence,calibration_arousal,calibration_stress=session_data[uid]['calibration']
		y_vals = [combined_valence, combined_arousal, combined_stress]
		labels = ['Valence', 'Arousal', 'Stress']
		calib_vals = [calibration_valence, calibration_arousal, calibration_stress]
		plot_graph(timestamps, y_vals, labels, combined_plot, calib_vals)


		df['calibrated_valence'] = [x - calibration_valence if isinstance(x, (int, float)) else x for x in combined_valence] 
		df['calibrated_arousal'] = [x - calibration_arousal if isinstance(x, (int, float)) else x for x in combined_arousal]
		df['calibrated_stress'] = [x - calibration_stress if isinstance(x, (int, float)) else x for x in combined_stress] 
		
		
		df.to_csv(os.path.join(output_dir,'combined_data.csv'), index=False)

		#generate metadata for Combined
		comb_meta_data={}
		try:
			avg_blink_duration= float(sum(combined_blinks)/(len(combined_blinks)))
		except:
			avg_blink_duration=0

		total_blinks=max([x for x in combined_eye if isinstance(x, (int, float))])

		comb_meta_data['eye_emotion_recognition'] = {
			"avg_blink_duration":avg_blink_duration,
			"total_blinks": total_blinks,
		}

		dict_list = session_data[uid]['class_wise_frame_counts']

		result = {}
		for d in dict_list:
			for key,value in d.items():
				result[key]=result.get(key,0)+value
		comb_meta_data['facial_emotion_recognition'] = {
			"class_wise_frame_count": result,
		}

		combined_weights = Counter()
		for word_weight in session_data[uid]['word_weights_list']:
			combined_weights.update(word_weight)
		combined_weights_dict = dict(combined_weights)
		comb_meta_data['speech_emotion_recognition'] = {
		'major_emotion':str(major_emotion),
		'pause_length':statistics.mean([row[0] for row in session_data[uid]['speech_data']]),
		'articulation_rate':statistics.mean([row[1] for row in session_data[uid]['speech_data']]),
		'speaking_rate':statistics.mean([row[2] for row in session_data[uid]['speech_data']]),
		'word_weights':combined_weights_dict,
		'pitch':comb_avg_pitch
		}
        
		log(f"🎉 Final metadata for combined video has been generated")
		api.send_analytics(combined_plot,{
			"uid": uid,
			"user_id": user_id, 
			"combined": comb_meta_data,
			"count": count
		})
		api.send_combined_analytics_files(uid, output_dir)
		del session_data[uid]
		shutil.rmtree(output_dir)
	except Exception as e:
		error_trace = traceback.format_exc()
		log(f"Error analyzing video for question - {count}: {error_trace}")
		api.send_error(uid, user_id, {
			"message": str(e),
			"trace": error_trace
		})
		del session_data[uid]
		shutil.rmtree(output_dir)
