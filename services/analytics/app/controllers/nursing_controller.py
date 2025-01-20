import os
from typing import Callable, Any
from app.functions.nursing import extractFrames, getPrediction, analyzePredictions
from app.utils.api import  NursingAPI
import traceback
import pandas as pd
import json
import time
import shutil

session_data={}

def analyze_nursing(video_path: str, uid: str, user_id: str, count: int, final: bool, test: bool, question_id: str, log: Callable[[str], None], cfg: Any, analyzer: Any):
		try:
			global session_data
			if uid not in session_data:
				session_data[uid] = {
					"processing_videos":[],
					"processed_videos":[]
				}

			while len(session_data[uid]['processing_videos']) != len(session_data[uid]['processed_videos']):
				time.sleep(10)

			session_data[uid]['processing_videos'].append(count)

			output_dir = os.path.join('/tmp/output', uid)
			api = NursingAPI(uid, user_id, output_dir)
			
			log(f"Extracting frames from video - {count}")
			frames = extractFrames(video_path, test)
			log(f"Getting predictions for total frames: {len(frames)} - {count}")
			predictions = getPrediction(cfg, analyzer, frames, count, log)
			log(f"Analyzing predictions - {count}")
			analysis = analyzePredictions(predictions)

			api.update_analytics({
				"uid": uid,
				"user_id": user_id,
				"individual": analysis,
				"count": count,
				"final": final,
				"question_id": question_id
			})
		
			def flatten_dict(data):
				flattened_data = []
				for key, value in data.items():
						if isinstance(value, dict):
								flattened_data.append((key, json.dumps(value)))  # Convert nested dict to a JSON string
						elif isinstance(value, list):
								flattened_data.append((key, str(value)))  # Convert list to a string representation
						else:
								flattened_data.append((key, value))  # Simple key-value pair
				return flattened_data

			analysis_df = pd.DataFrame(flatten_dict(analysis), columns=['Key', 'Value'])
			predictions_df = pd.DataFrame(flatten_dict(predictions), columns=['Key', 'Value'])
			
			data_output_dir = os.path.join(output_dir, str(count))
			os.makedirs(data_output_dir, exist_ok=True) 
			excel_path = os.path.join(data_output_dir, 'data_logs.xlsx')

			try:
					with pd.ExcelWriter(excel_path, engine='openpyxl') as writer:
							analysis_df.to_excel(writer, index=False, sheet_name='Analysis')
							predictions_df.to_excel(writer, index=False, sheet_name='Predictions')
					print(f"Data successfully saved to {excel_path}")
			except Exception as e:
					print(f"Error saving Excel file: {e}")
			log(f"Analytics generated - {count}")
			api.save_files(count)

			session_data[uid]['processed_videos'].append(count)

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
