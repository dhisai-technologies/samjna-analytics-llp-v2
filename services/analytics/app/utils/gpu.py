import torch
import tensorflow as tf
import os

def setup_gpu():
    # PyTorch Configuration
    if torch.cuda.is_available():
        device = "cuda"
        torch.backends.cudnn.benchmark = True
        print(f"Using GPU: {torch.cuda.get_device_name(0)}")
    elif torch.backends.mps.is_available():
        device = "mps"
        print("Using Metal Performance Shaders (MPS) for PyTorch on Mac.")
    else:
        device = "cpu"
        print("No GPU found. Using CPU.")

    # TensorFlow Configuration
    physical_devices = tf.config.experimental.list_physical_devices('GPU')
    if physical_devices:
        try:
            for gpu in physical_devices:
                tf.config.experimental.set_memory_growth(gpu, True)  # Prevents memory hogging
            print(f"TensorFlow using {len(physical_devices)} GPU(s).")
        except RuntimeError as e:
            print(f"TensorFlow GPU setup error: {e}")
    else:
        print("TensorFlow is using CPU.")

    if os.getenv("DOCKER_CONTAINER"):
        print("Running in Docker: Ensuring GPU is utilized if available.")

    return device
