import base64, json, sys, urllib.request
img_path = sys.argv[1]
with open(img_path, 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('ascii')
body = json.dumps({'image': 'data:image/jpeg;base64,' + b64}).encode('utf-8')
req = urllib.request.Request('http://localhost:5000/debug/classify-design', data=body, headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req, timeout=30) as resp:
    print(resp.status, resp.read().decode('utf-8'))
