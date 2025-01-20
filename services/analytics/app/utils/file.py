from fastapi import UploadFile
import requests
from urllib.parse import urlparse, unquote
from fastapi import UploadFile, File, Form, HTTPException
from typing import Optional
import os


def get_file_or_url(files: UploadFile = File(None), url: str = Form(None)):
		if files and url:
				raise HTTPException(status_code=400, detail="Both file and URL provided, please send only one")
		if files or url:
				return files, url

async def get_filepath(uid: str, count: int, file: Optional[UploadFile] = None, url: Optional[str] = None):
		output_dir = os.path.join("/tmp/output", uid)
		if not os.path.exists(output_dir):
				os.makedirs(output_dir)
		folder_path=os.path.join(output_dir,f'{count}')
		if not os.path.exists(folder_path):
				os.makedirs(folder_path)
		if file:
				return await filepath_file(folder_path, file)
		if url:
				return await filepath_url(folder_path, url)
		if not file and not url:
				raise HTTPException(status_code=400, detail="No file or URL provided, please send either one")

async def filepath_file(folder_path:str, file: UploadFile):
		try:
			file_path = f"{folder_path}/{file.filename}"
			with open(file_path, "wb") as f:
				f.write(file.file.read())
			return file_path
		except:
			return None

async def filepath_url(folder_path:str, url: str):
		try:
				response = requests.get(url)
				response.raise_for_status()       
				parsed_url = urlparse(url)
				filename = unquote(parsed_url.path.split('/')[-1]) or f"temp.webm" 
				file_path = f"{folder_path}/{filename}"
				with open(file_path, "wb") as f:
						f.write(response.content)
				return file_path
		except:
				return None