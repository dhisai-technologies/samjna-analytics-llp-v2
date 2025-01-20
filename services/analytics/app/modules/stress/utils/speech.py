import speech_recognition as sr
import librosa
import os
import nltk
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow
from tensorflow.keras.models import load_model # type: ignore
import numpy as np
import pandas as pd
import soundfile as sf
import statistics
from pyAudioAnalysis import audioSegmentation as aS

import nltk
nltk.download('punkt_tab')
nltk.download('averaged_perceptron_tagger_eng')

label_mapping = {
    0: 'angry',
    1: 'disgust',
    2: 'fear',
    3: 'happy',
    4: 'neutral',
    5: 'sad',
    6: 'surprise',
}
def features_extractor(file_name):
    audio, sample_rate = librosa.load(file_name, res_type='kaiser_best')

    mfccs_features = librosa.feature.mfcc(y=audio, sr=sample_rate, n_mfcc=40)
    mfccs_scaled_features = np.mean(mfccs_features.T, axis=0)

    # Extract Chroma Features
    chroma = librosa.feature.chroma_stft(y=audio, sr=sample_rate,n_chroma=12)
    chroma_scaled_features = np.mean(chroma.T, axis=0)

    # Extract Mel Spectrogram Features
    mel = librosa.feature.melspectrogram(y=audio, sr=sample_rate)
    mel_scaled_features = np.mean(mel.T, axis=0)

    # Concatenate all features into a single array
    features = np.hstack((mfccs_scaled_features,  chroma_scaled_features, mel_scaled_features))

    return features
def extract_prosodic_features(file_path):
    # Load the audio file
    y, sr = librosa.load(file_path, sr=None)

    # Extract pitch (fundamental frequency)
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)

    # Filter out zero values for pitch calculation
    non_zero_pitches = pitches[pitches > 0]
    if non_zero_pitches.size > 0:
        pitch = np.mean(non_zero_pitches)
    else:
        pitch = 0  # Handle case with no valid pitches

    # Extract rhythm features (tempo)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)

    # Extract tone (spectral centroid)
    spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))

    return pitch, tempo, spectral_centroid
def predict_emotions(audio_path, segment_path, interval,model_s):
    audio_data, samplerate = sf.read(audio_path)
    duration = len(audio_data) / samplerate
    emotions = []
    pitch=[]
    rythm=[]
    tone=[]
    for start in np.arange(0, duration, interval):
        end = start + interval
        if end > duration:
            end = duration
        segment = audio_data[int(start*samplerate):int(end*samplerate)]
        sf.write(segment_path, segment, samplerate)
        # Extract features
        pitch_,rythm_,tone_=extract_prosodic_features(segment_path)
        pitch.append(pitch_)
        rythm.append(rythm_)
        tone.append(tone_)
        feat = features_extractor(segment_path)
        if feat is not None:
            feat = feat.reshape(1, -1)
            predictions = np.argmax(model_s.predict(feat),axis=1)
            emotions.append(label_mapping[predictions[0]])

    return emotions,[pitch,rythm,tone]

def recognize_speech_from_file(audio_file_path,recognizer):
    audio_file = sr.AudioFile(audio_file_path)  # Load the audio file
    with audio_file as source:  # Use the audio file as the source
        audio = recognizer.record(source)  # Record the audio
    try:
        # Recognize the speech using Google's Web Speech API
        transcript = recognizer.recognize_google(audio)
        return transcript  # Return the transcript
    except sr.UnknownValueError:  # If the speech is unintelligible
        return None
    except sr.RequestError as e:  # If there's an error with the API request
        print(f"Could not request results from Google Speech Recognition service; {e}")
        return None

def count_words(text):
    words = text.split()  # Split the text into words
    return len(words)  # Return the number of words

def estimate_syllables(text):
    syllable_count = 0  # Initialize syllable count
    words = text.split()  # Split the text into words
    for word in words:  # Iterate through each word
        # Count the vowels in the word to estimate syllables
        syllable_count += len([c for c in word if c.lower() in 'aeiou'])
    return syllable_count  # Return the syllable count

def get_speaking_rate(file_path, transcript):
    y, sr = librosa.load(file_path, sr=None)  # Load the audio file
    total_duration = len(y) / sr  # Calculate the total duration of the audio
    num_syllables = estimate_syllables(transcript)  # Estimate the number of syllables
    speaking_rate = num_syllables / total_duration if total_duration > 0 else 0  # Calculate the speaking rate
    return speaking_rate  # Return the speaking rate

def calculate_pause_metrics(file_path):
    y, sr = librosa.load(file_path, sr=None)  # Load the audio file
    # Remove silence and get the segments
    segments = aS.silence_removal(y, sr, 0.020, 0.020, smooth_window=1.0, weight=0.3, plot=False)
    total_duration = len(y) / sr  # Calculate the total duration
    speech_duration = sum([end - start for start, end in segments])  # Calculate the speech duration
    pause_duration = total_duration - speech_duration  # Calculate the pause duration
    num_pauses = len(segments) - 1 if len(segments) > 0 else 0  # Calculate the number of pauses
    average_pause_length = pause_duration / num_pauses if num_pauses > 0 else 0  # Calculate the average pause length
    return average_pause_length  # Return the average pause length and number of pauses

def calculate_articulation_rate(file_path, transcript):
    y, sr = librosa.load(file_path, sr=None)  # Load the audio file
    # Remove silence and get the segments
    segments = aS.silence_removal(y, sr, 0.020, 0.020, smooth_window=1.0, weight=0.3, plot=False)
    speech_duration = sum([end - start for start, end in segments])  # Calculate the speech duration
    num_syllables = estimate_syllables(transcript)  # Estimate the number of syllables
    articulation_rate = num_syllables / speech_duration if speech_duration > 0 else 0  # Calculate the articulation rate
    return articulation_rate  # Return the articulation rate


def pos_tag_and_filter(transcript):
    words = nltk.word_tokenize(transcript)
    pos_tags = nltk.pos_tag(words)
    
    # Define important POS tags
    important_tags = {'NN', 'NNS', 'NNP', 'NNPS', 'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ', 'JJ', 'JJR', 'JJS', 'RB', 'RBR', 'RBS'}  
    filtered_words = []
    for word, tag in pos_tags:
        if tag in important_tags:
            filtered_words.append((word, tag))
    return filtered_words

def load_values(file_path):
    values_dict = {}
    with open(file_path, 'r') as file:
        for line in file:
            word, value = line.strip().split('\t')
            values_dict[word.lower()] = float(value)
    return values_dict

# Map values to filtered words
def map_values_to_filtered_words(filtered_words, valence_dict, arousal_dict, dominance_dict):
    word_weights = {}
    
    for word in filtered_words:
        word_lower = word.lower()
        
        # Initialize weight
        word_weights[word] = 0
        
        # Try to get valence and add to weight
        try:
            valence = valence_dict[word_lower]
            valence = (valence + 1) / 2  # Normalize if found
            word_weights[word] += valence
        except KeyError:
            pass  # Valence not found, continue
        
        # Try to get arousal and add to weight
        try:
            arousal = arousal_dict[word_lower]
            arousal = (arousal + 1) / 2  # Normalize if found
            word_weights[word] += arousal
        except KeyError:
            pass  # Arousal not found, continue
        
        # Try to get dominance and add to weight
        try:
            dominance = dominance_dict[word_lower]
            word_weights[word] += dominance  # No need to normalize
        except KeyError:
            pass  # Dominance not found, continue
    
    return word_weights

def generate_word_cloud(word_weights):
    if len(word_weights)>0:
        return word_weights
def analyze_audio(file_path,valence_dict,arousal_dict,dominance_dict,recognizer):
    # Get the transcript of the audio
    
    # transcript = "I want you to act like he's coming back, both of you. Don't think I haven't noticed you since he in..."
    transcript = recognize_speech_from_file(file_path,recognizer)
    print(transcript)
    if not transcript:  # If transcript is not available
        transcript = "I want you to act like he's coming back, both of you. Don't think I haven't noticed you since he in..."

    filtered_words_with_tags = pos_tag_and_filter(transcript)
    filtered_words = [word for word, tag in filtered_words_with_tags]


    word_weights = map_values_to_filtered_words(filtered_words, valence_dict, arousal_dict, dominance_dict)
    # Calculate various metrics

    word_weights=generate_word_cloud(word_weights)
    word_count = count_words(transcript)  # Count the number of words
    speaking_rate = get_speaking_rate(file_path, transcript) # Calculate the speaking rate
    average_pause_length = calculate_pause_metrics(file_path)  # Calculate pause metrics
    articulation_rate = calculate_articulation_rate(file_path, transcript)  # Calculate the articulation rate
    
    word={} 
    word['word_count']=word_count
    word['word_weights']=word_weights
    word['speaking_rate']=speaking_rate
    word['average_pause_length']=average_pause_length
    word['articulation_rate']=articulation_rate
    return word

def speech_predict(audio_path, segment_path,model_s,valence_dict,arousal_dict,dominance_dict,interval,recognizer):
    
    emotions,prosody_f = predict_emotions(audio_path, segment_path, interval,model_s)
    
    # Save emotions to a log file
    # Extrapolate major emotions
    major_emotion = statistics.mode(emotions)
    word = analyze_audio(audio_path,valence_dict,arousal_dict,dominance_dict,recognizer)
    return emotions,major_emotion,word,prosody_f
