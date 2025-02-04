from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import numpy as np
import pandas as pd
import os

@csrf_exempt
def process_keystrokes(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        email_id = data['email_id']
        type_id = data['type']
        instance = data['instance']
        keystrokes = data['keystrokes']
        
        # Initialize dictionaries
        keypresses = {}  # For single key press durations
        digraph_delays = {}  # For pairs of keys
        
        # Calculate key press durations and digraph delays
        for i, event in enumerate(keystrokes):
            if event['event'] == 'keydown':
                current_key = event['key']
                current_down = event['timestamp']
                
                # Find corresponding keyup
                for j in range(i + 1, len(keystrokes)):
                    if keystrokes[j]['event'] == 'keyup' and keystrokes[j]['key'] == current_key:
                        if current_key.isalpha():
                            if current_key not in keypresses:
                                keypresses[current_key] = []
                            keypresses[current_key].append(keystrokes[j]['timestamp'] - current_down)
                        break
                
                # Find next keydown for digraph
                for j in range(i + 1, len(keystrokes)):
                    if keystrokes[j]['event'] == 'keydown':
                        next_key = keystrokes[j]['key']
                        if current_key.isalpha() and next_key.isalpha():
                            pair = f"{current_key}{next_key}"
                            if pair not in digraph_delays:
                                digraph_delays[pair] = []
                            
                            # Calculate average of (H-down - T-down) and (H-up - T-down)
                            up_time = None
                            for k in range(i + 1, j):
                                if keystrokes[k]['event'] == 'keyup' and keystrokes[k]['key'] == current_key:
                                    up_time = keystrokes[k]['timestamp']
                                    break
                            
                            if up_time:
                                delay = ((keystrokes[j]['timestamp'] - current_down) + 
                                       (up_time - current_down)) / 2
                                digraph_delays[pair].append(delay)
                        break
        
        results = {
            'email_id': email_id,
            'type': type_id,
            'instance': instance
        }
        
        # Single key statistics
        for key in 'abcdefghijklmnopqrstuvwxyz':
            if key in keypresses and len(keypresses[key]) > 0:
                results[f'{key}_mean'] = np.mean(keypresses[key])
                results[f'{key}_std'] = np.std(keypresses[key]) if len(keypresses[key]) > 1 else np.nan
            else:
                results[f'{key}_mean'] = np.nan
                results[f'{key}_std'] = np.nan
        
        # Digraph statistics
        for c1 in 'abcdefghijklmnopqrstuvwxyz':
            for c2 in 'abcdefghijklmnopqrstuvwxyz':
                pair = f"{c1}{c2}"
                if pair in digraph_delays and len(digraph_delays[pair]) > 0:
                    results[f'{pair}_mean'] = np.mean(digraph_delays[pair])
                    results[f'{pair}_std'] = np.std(digraph_delays[pair]) if len(digraph_delays[pair]) > 1 else np.nan
                else:
                    results[f'{pair}_mean'] = np.nan
                    results[f'{pair}_std'] = np.nan
        
        csv_file = 'data.csv'
        df = pd.DataFrame([results])
        
        if not os.path.exists(csv_file):
            df.to_csv(csv_file, index=False)
        else:
            df.to_csv(csv_file, mode='a', header=False, index=False)
        
        return JsonResponse({'status': 'success', 'message': 'Data processed and saved'})
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)