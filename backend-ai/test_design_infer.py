import importlib.util
from PIL import Image

spec = importlib.util.spec_from_file_location('backend_server', 'server.py')
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)

img = Image.open('../DESIGN/Training/no_tumor/1.jpg')
print('design_model loaded?', server.design_model is not None)
print('design_class_to_idx:', server.design_class_to_idx)
print('classify_design_model ->', server.classify_design_model(img))
print('classify_brain_disease ->', server.classify_brain_disease(img))
