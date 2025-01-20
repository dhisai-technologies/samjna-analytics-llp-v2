from facetorch import FaceAnalyzer
import cv2
import numpy as np


def initAnalyzer(cfg):
    analyzer = FaceAnalyzer(cfg.analyzer)
    return analyzer

def extractFrames(video_path: str, test: bool):
    all_frames = []
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return

    fps = cap.get(cv2.CAP_PROP_FPS)

    frame_count = 0
    while True:
        ret, frame = cap.read()        
        if not ret:
            break
        frame_count += 1
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        all_frames.append(rgb_frame)

        if test and frame_count > 100:
            break

    print(f"Total Frames Extracted: {frame_count} at FPS of {fps}")
    return all_frames

def getPrediction(cfg, analyzer, frames, question_count, log):
    predictions = {}
    total_frames = len(frames)

    for i, frame in enumerate(frames):    
        try:
            response = analyzer.run(
                    image_source=frame,
                    batch_size=cfg.batch_size,
                    fix_img_size=cfg.fix_img_size,
                    return_img_data=cfg.return_img_data,
                    include_tensors=cfg.include_tensors
                    )
                    
            predictions[f"fp_{i}"] = {
                "dominant_emotion": response.faces[0].preds['fer'].label if 'fer' in response.faces[0].preds else None,
                "action_units": response.faces[0].preds['au'].other.get('multi', None) if 'au' in response.faces[0].preds else None,
                "valence": response.faces[0].preds['va'].other.get('valence', None) if 'va' in response.faces[0].preds else None,
                "arousal": response.faces[0].preds['va'].other.get('arousal', None) if 'va' in response.faces[0].preds else None
                }

        except Exception as e:
            print(e)
        
        if (i + 1) % 30 == 0 or (i + 1) == total_frames:
            log(f"Processed {i + 1}/{total_frames} frames - {question_count}")
    
    return predictions

def analyzePredictions(predictions):
    disgust_frames = 0
    non_disgust_frames = 0
    emotion_counts = {}
    action_unit_counts = {}
    valence_all = []
    arousal_all = []
    valence_disgust = []
    arousal_disgust = []
    valence_non_disgust = []
    arousal_non_disgust = []
    
    total_frames = len(predictions)
    
    for key, pred in predictions.items():
        dominant_emotion = pred["dominant_emotion"]
        if dominant_emotion:
            dominant_emotion = dominant_emotion.lower()
        else:
            dominant_emotion = ""

        if dominant_emotion == "disgust":
            disgust_frames += 1
            valence_disgust.append(pred["valence"])
            arousal_disgust.append(pred["arousal"])
        else:
            non_disgust_frames += 1
            valence_non_disgust.append(pred["valence"])
            arousal_non_disgust.append(pred["arousal"])

        if dominant_emotion not in emotion_counts:
            emotion_counts[dominant_emotion] = 0
        emotion_counts[dominant_emotion] += 1
        
        action_units = pred["action_units"]
        if action_units:
            for au in action_units:
                if au not in action_unit_counts:
                    action_unit_counts[au] = 0
                action_unit_counts[au] += 1
        
        valence_all.append(pred["valence"])
        arousal_all.append(pred["arousal"])

    percentage_disgust = (disgust_frames / total_frames) * 100 if total_frames > 0 else 0
    emotion_percentages = {emotion: (count / total_frames) * 100 for emotion, count in emotion_counts.items()}
    action_unit_percentages = {au: (count / total_frames) * 100 for au, count in action_unit_counts.items()}

    valence_mean = np.mean(valence_all) if valence_all else None
    valence_std = np.std(valence_all) if valence_all else None
    arousal_mean = np.mean(arousal_all) if arousal_all else None
    arousal_std = np.std(arousal_all) if arousal_all else None

    valence_mean_disgust = np.mean(valence_disgust) if valence_disgust else None
    valence_std_disgust = np.std(valence_disgust) if valence_disgust else None
    arousal_mean_disgust = np.mean(arousal_disgust) if arousal_disgust else None
    arousal_std_disgust = np.std(arousal_disgust) if arousal_disgust else None

    valence_mean_non_disgust = np.mean(valence_non_disgust) if valence_non_disgust else None
    valence_std_non_disgust = np.std(valence_non_disgust) if valence_non_disgust else None
    arousal_mean_non_disgust = np.mean(arousal_non_disgust) if arousal_non_disgust else None
    arousal_std_non_disgust = np.std(arousal_non_disgust) if arousal_non_disgust else None

    percentage_disgust_ = percentage_disgust if percentage_disgust else 0
    valence_mean_disgust_ = valence_mean_disgust if valence_mean_disgust else 0
    arousal_mean_disgust_ = arousal_mean_disgust if arousal_mean_disgust else 0
    
    percentage_disgust_normalized = percentage_disgust_ / 100  
    valence_normalized = (valence_mean_disgust_ + 1) / 2
    arousal_normalized = (arousal_mean_disgust_ + 1) / 2

    disgust_score = (percentage_disgust_normalized + valence_normalized + arousal_normalized) / 3 * 4

    analysis_results = {
        "total_frames": total_frames,
        "disgust_frames": disgust_frames,
        "non_disgust_frames": non_disgust_frames,
        "percentage_disgust": float(percentage_disgust),
        "emotion_counts": emotion_counts,
        "emotion_percentages": emotion_percentages,
        "action_unit_counts": action_unit_counts,
        "action_unit_percentages": action_unit_percentages,
        "valence_mean": valence_mean,
        "valence_std": valence_std,
        "arousal_mean": arousal_mean,
        "arousal_std": arousal_std,
        "valence_mean_disgust": valence_mean_disgust,
        "valence_std_disgust": valence_std_disgust,
        "arousal_mean_disgust": arousal_mean_disgust,
        "arousal_std_disgust": arousal_std_disgust,
        "valence_mean_non_disgust": valence_mean_non_disgust,
        "valence_std_non_disgust": valence_std_non_disgust,
        "arousal_mean_non_disgust": arousal_mean_non_disgust,
        "arousal_std_non_disgust": arousal_std_non_disgust,
        "valence_all": valence_all,
        "arousal_all": arousal_all,
        "valence_disgust": valence_disgust,
        "arousal_disgust": arousal_disgust,
        "valence_non_disgust": valence_non_disgust,
        "arousal_non_disgust": arousal_non_disgust,
        "disgust_score": max(1.0, disgust_score)
    }

    return analysis_results

