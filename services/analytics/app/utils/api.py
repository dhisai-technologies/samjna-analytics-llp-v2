import json
import requests
from dotenv import load_dotenv
import os

load_dotenv()

API_URL = os.getenv("API_URL")
CORE_API_URL = f"{API_URL}/core-service"
API_KEY = os.getenv("API_KEY")

headers = {
    'x-api-key': API_KEY
}

class StressAPI:
    def send_analytics(self, plot: str, json_data: dict = None):
        try:
            with open(plot, 'rb') as plot_file:
                files = {
                    'plot': (plot, plot_file, 'application/octet-stream'),
                    'json_data': ('json_data', json.dumps(json_data), 'application/json')
                }
                response = requests.post(
                    f'{CORE_API_URL}/v1/stress/analytics',
                    files=files,
                    headers=headers,
                    timeout=60
                )
            if response.status_code == 200:
                print("Successfully sent analytics. Status code:", response.status_code)
            else:
                print("Failed to send analytics. Status code:", response.status_code)
        except Exception as e:
            print("Error sending analytics: ", e)

    def send_file(self, file_path: str, json: dict = None):
        try:
            with open(file_path, 'rb') as file:
                files = {'file': (file_path, file, 'application/octet-stream')}
                data = {key: value for key, value in json.items()} if json else {}
                response = requests.post(
                    f'{CORE_API_URL}/v1/stress/analytics/file',
                    files=files,
                    headers=headers,
                    data=data,
                    timeout=60
                )
            if response.status_code == 200:
                print("Successfully sent file. Status code:", response.status_code)
            else:
                print("Failed to send file. Status code:", response.status_code)
        except Exception as e:
            print("Error sending file:", e)
            
    def send_combined_analytics_files(self, uid: str, output_dir: str):
        data_logs = f"{output_dir}/combined_data.csv"
        speech_logs = f"{output_dir}/combined_speech.csv"
        files = [data_logs, speech_logs]
        files = [{"name": "data_logs", "path": data_logs}, {"name": "speech_logs", "path": speech_logs}]
        for file in files:
            self.send_file(file["path"], {"uid": uid, "name": file["name"] })
            
    def send_error(self, uid: str, user_id: str, error: dict):
        try:
            response = requests.post(
                f'{CORE_API_URL}/v1/stress/analytics/error',
                json={"uid": uid, "user_id": user_id, "error": error},
                headers=headers,
                timeout=60
            )
            if response.status_code == 200:
                print("Successfully sent error. Status code:", response.status_code)
            else:
                print("Failed to send error. Status code:", response.status_code)
        except Exception as e:
            print("Error sending error:", e)

class InterviewAPI:
    def __init__(self, uid: str, user_id: str, output_dir: str):
        self.uid = uid
        self.user_id = user_id
        self.output_dir = output_dir

    def __save_file__(self, file_path: str, json_data: dict = None):
        try:
            with open(file_path, 'rb') as file:
                files = {'file': (file_path, file, 'application/octet-stream')}
                data = {key: value for key, value in json_data.items()} if json_data else {}
                response = requests.post(
                    f'{CORE_API_URL}/v1/interviews/analytics/file',
                    files=files,
                    headers=headers,
                    data=data,
                    timeout=60
                )
            if response.status_code == 200:
                print("Successfully saved file. Status code:", response.status_code)
            else:
                print("Failed to save file. Status code:", response.status_code)
        except Exception as e:
            print("Error sending file:", e)
    
    def save_files(self):
        data_logs = f"{self.output_dir}/combined_data.csv"
        files = [{"name": "data_logs", "path": data_logs}]
        for file in files:
            self.__save_file__(file["path"], {"uid": self.uid, "name": file["name"] })

    def update_individual_analytics(self, valence_plot: str, ratio_plot: str, word_cloud: str, json_data: dict = None):
        try:
            with open(valence_plot, 'rb') as plot_file , open(ratio_plot, 'rb') as plot_file2, open(word_cloud, 'rb') as plot_file3:
                files = {
                    'valence_plot': (valence_plot, plot_file, 'application/octet-stream'),
                    'ratio_plot': (ratio_plot, plot_file2, 'application/octet-stream'),
                    'word_cloud': (word_cloud, plot_file3, 'application/octet-stream'),
                    'json_data': ('json_data', json.dumps(json_data), 'application/json')
                }
                response = requests.post(
                    f'{CORE_API_URL}/v1/interviews/analytics',
                    files=files,
                    headers=headers,
                    timeout=60
                )
            if response.status_code == 200:
                print("Successfully sent analytics. Status code:", response.status_code)
            else:
                print("Failed to send analytics. Status code:", response.status_code)
        except Exception as e:
            print("Error sending analytics: ", e)

    def update_combined_analytics(self, valence_plot: str, ratio_plot: str, json_data: dict = None):
        try:
            with open(valence_plot, 'rb') as plot_file , open(ratio_plot, 'rb') as plot_file2:
                files = {
                    'valence_plot': (valence_plot, plot_file, 'application/octet-stream'),
                    'ratio_plot': (ratio_plot, plot_file2, 'application/octet-stream'),
                    'json_data': ('json_data', json.dumps(json_data), 'application/json')
                }
                response = requests.post(
                    f'{CORE_API_URL}/v1/interviews/analytics',
                    files=files,
                    headers=headers,
                    timeout=60
                )
            if response.status_code == 200:
                print("Successfully sent analytics. Status code:", response.status_code)
            else:
                print("Failed to send analytics. Status code:", response.status_code)
        except Exception as e:
            print("Error sending analytics: ", e)

    
    def update_info(self, message: str):
        try:
            response = requests.post(
                f'{CORE_API_URL}/v1/interviews/analytics/info',
                json={"uid": self.uid, "message": message},
                headers=headers,
                timeout=60
            )
            if response.status_code == 200:
                print("Successfully logged info. Status code:", response.status_code)
            else:
                print("Failed to log info. Status code:", response.status_code)
        except Exception as e:
            print("Error logging info:", e)
    
    def save_error(self, error: dict):
        try:
            response = requests.post(
                f'{CORE_API_URL}/v1/interviews/analytics/error',
                json={"uid": self.uid, "user_id": self.user_id, "error": error},
                headers=headers,
                timeout=60
            )
            if response.status_code == 200:
                print("Successfully logged error. Status code:", response.status_code)
            else:
                print("Failed to log error. Status code:", response.status_code)
        except Exception as e:
            print("Error logging error:", e)

class NursingAPI:
    def __init__(self, uid: str, user_id: str, output_dir: str):
        self.uid = uid
        self.user_id = user_id
        self.output_dir = output_dir

    def __save_file__(self, file_path: str, json_data: dict = None):
        try:
            with open(file_path, 'rb') as file:
                files = {'file': (file_path, file, 'application/octet-stream')}
                data = {key: value for key, value in json_data.items()} if json_data else {}
                response = requests.post(
                    f'{CORE_API_URL}/v1/nursing/analytics/file',
                    files=files,
                    headers=headers,
                    data=data,
                    timeout=60
                )
            if response.status_code == 200:
                print("Successfully saved file. Status code:", response.status_code)
            else:
                print("Failed to save file. Status code:", response.status_code)
        except Exception as e:
            print("Error sending file:", e)
    
    def save_files(self, count: int):
        data_logs = f"{self.output_dir}/{count}/data_logs.xlsx"
        files = [{"name": "data_logs", "path": data_logs}]
        for file in files:
            self.__save_file__(file["path"], {"uid": self.uid, "name": file["name"], "count": count })

    def update_analytics(self, json_data: dict = None):
        try:
            files = {}
            if json_data:
                files['json_data'] = ('json_data', json.dumps(json_data), 'application/json')

            if files:
                response = requests.post(
                    f'{CORE_API_URL}/v1/nursing/analytics',
                    files=files,
                    headers=headers,
                    timeout=60
                )
                if response.status_code == 200:
                    print("Successfully sent analytics. Status code:", response.status_code)
                else:
                    print("Failed to send analytics. Status code:", response.status_code)
            else:
                print("No data to send. Both plots and json_data are None.")
        except Exception as e:
            print("Error sending analytics: ", e)
    
    def update_info(self, message: str):
        try:
            response = requests.post(
                f'{CORE_API_URL}/v1/nursing/analytics/info',
                json={"uid": self.uid, "message": message},
                headers=headers,
                timeout=60
            )
            if response.status_code == 200:
                print("Successfully logged info. Status code:", response.status_code)
            else:
                print("Failed to log info. Status code:", response.status_code)
        except Exception as e:
            print("Error logging info:", e)
    
    def save_error(self, error: dict):
        try:
            response = requests.post(
                f'{CORE_API_URL}/v1/nursing/analytics/error',
                json={"uid": self.uid, "user_id": self.user_id, "error": error},
                headers=headers,
                timeout=60
            )
            if response.status_code == 200:
                print("Successfully logged error. Status code:", response.status_code)
            else:
                print("Failed to log error. Status code:", response.status_code)
        except Exception as e:
            print("Error logging error:", e)