import time
import numpy as np
import pandas as pd
from pynput import keyboard

# Define global variables
keys = list("abcdefghijklmnopqrstuvwxyz ")  # Include space as a key
inter_key_data = {key: {k: [] for k in keys} for key in keys}
key_press_durations = {key: [] for key in keys}
last_key = None
last_key_time = None
key_press_start = {}

def get_key_char(key):
    """Returns the character of the key, handling spaces and exceptions."""
    try:
        return key.char.lower() if hasattr(key, "char") and key.char else " "
    except AttributeError:
        return None

def calculate_threshold(data):
    """Calculates the threshold using mean + 3 * standard deviation."""
    if not data:
        return 1.0  # Return a default threshold if no data is available
    data_array = np.array(data)
    mean = data_array.mean()
    std_dev = data_array.std()
    return 2 * mean + 10 * std_dev  # mean + 3 * standard deviation

def on_press(key):
    """Callback function to handle key press events."""
    global last_key, last_key_time, key_press_start
    key_char = get_key_char(key)
    if key_char in keys:
        now = time.time()

        # Record inter-key delay and check threshold for exclusion
        if last_key and last_key_time:
            delay = now - last_key_time
            all_delays = [d for sublist in inter_key_data[last_key].values() for d in sublist]
            threshold = calculate_threshold(all_delays)

            # Ignore delay if it exceeds the threshold (pause between typing)
            if delay > threshold:
                print(f"Ignored delay {delay:.3f}s from '{last_key}' to '{key_char}' (Threshold: {threshold:.3f}s)")
            else:
                inter_key_data[last_key][key_char].append(delay)

        # Record the start time of key press for duration calculation
        key_press_start[key_char] = now
        last_key = key_char
        last_key_time = now

def on_release(key):
    """Callback function to handle key release events."""
    key_char = get_key_char(key)
    if key_char in key_press_start:
        # Record the duration of key press
        press_duration = time.time() - key_press_start[key_char]
        key_press_durations[key_char].append(press_duration)
        del key_press_start[key_char]

def calculate_statistics(data):
    """Calculates mean and standard deviation for a list of data."""
    if not data:
        return None, None  # Return None if there's no data
    data_array = np.array(data)
    return data_array.mean(), data_array.std()

def summarize_statistics():
    """Summarizes and displays inter-key delays and key press durations."""
    # Summarize inter-key delay statistics (mean, std) for each key combination
    vector = []

    for i in keys:
        for j in keys:
            mean, std = calculate_statistics(inter_key_data[i][j])
            vector.append(mean if mean is not None else None)
            vector.append(std if std is not None else None)

    # Add key press duration statistics to the vector
    for key in keys:
        mean, std = calculate_statistics(key_press_durations[key])
        vector.append(mean if mean is not None else None)
        vector.append(std if std is not None else None)

    return vector

def main():
    """Main function for typing test and recording typing characteristics."""
    print("\nTyping Test: You will type 10 paragraphs. Typing characteristics will be recorded.")
    print("Large delays (pauses or outliers) will be ignored and displayed on the terminal.")

    session_vectors = []  # List to store vectors for each session

    with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
        for i in range(1):  # 10 typing sessions (paragraphs)
            input(f"\nType paragraph {i + 1} and press Enter when done: ")

            # Generate a vector for the current session after typing
            vector = summarize_statistics()
            session_vectors.append(vector)  # Append the vector for this session

            # Reset data for next session
            global inter_key_data, key_press_durations
            inter_key_data = {key: {k: [] for k in keys} for key in keys}
            key_press_durations = {key: [] for key in keys}

        listener.stop()

    # Print all the session vectors
    print("\nFinal 1D Vectors for Each Typing Session:")
    for idx, vector in enumerate(session_vectors):
        print(f"Session {idx + 1}: {vector}")

    print("\nTyping session completed!")

if __name__ == "__main__":
    main()