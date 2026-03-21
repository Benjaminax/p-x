import base64, requests, json, sys
p = r'..\..\DESIGN\Training\no_tumor\1.jpg'
with open(p,'rb') as f:
    b = base64.b64encode(f.read()).decode()
resp = requests.post('http://localhost:5000/process-image', json={'image': 'data:image/jpeg;base64,'+b})
print('status', resp.status_code)
try:
    print(json.dumps(resp.json(), indent=2))
except Exception as e:
    print('no json', e)
