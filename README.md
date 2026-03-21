# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Training the DESIGN model 🔧

The project is configured to train the classifier using the labeled folders under `DESIGN/Training`.
- Folder structure required: `DESIGN/Training/<label>/*.jpg|*.png`
- Only the following DESIGN labels are used by the system: `glioma_tumor`, `meningioma_tumor`, `pituitary_tumor`, `no_tumor`.

Quick commands:

- Install Python dependencies: `pip install -r backend-ai/requirements.txt`
- Train (uses `DESIGN/Training` by default): `python backend-ai/training/train.py` or `npm run train:ai`
- Evaluate: `python backend-ai/training/evaluate.py` or `npm run eval:ai`

The training script will automatically filter to the DESIGN folders (it ignores other folders) and will write the model to `models/multi_disease_from_design.pth` and the label map to `models/class_to_idx.json`.
