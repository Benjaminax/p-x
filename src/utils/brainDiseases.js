// Minimal Brain Diseases reference — only the 4 DESIGN training labels
export const BRAIN_DISEASES = {
    'glioma_tumor': {
        fullName: 'Glioma (Tumor)',
        imagingFindings: ['Mass lesion', 'Perilesional edema', 'Heterogeneous enhancement'],
        commonLabels: ['glioma', 'glioblastoma', 'gbm'],
        severity: 'high'
    },
    'meningioma_tumor': {
        fullName: 'Meningioma',
        imagingFindings: ['Extra-axial enhancing mass', 'Dural tail', 'Mass effect'],
        commonLabels: ['meningioma'],
        severity: 'high'
    },
    'pituitary_tumor': {
        fullName: 'Pituitary Tumor',
        imagingFindings: ['Sellar/suprasellar mass', 'Hormonally active lesion'],
        commonLabels: ['pituitary', 'sella', 'prolactinoma'],
        severity: 'medium'
    },
    'no_tumor': {
        fullName: 'No Tumor / Normal',
        imagingFindings: ['No focal mass', 'Normal parenchyma'],
        commonLabels: ['normal', 'no tumor', 'no_intracranial'],
        severity: 'low'
    }
}

export const getDiseaseInfo = (diagnosisText) => {
    if (!diagnosisText) return null
    const l = diagnosisText.toLowerCase()
    for (const [key, disease] of Object.entries(BRAIN_DISEASES)) {
        // match on common label tokens or the key itself
        if (l.includes(key) || (disease.commonLabels || []).some(t => l.includes(t))) {
            return disease
        }
    }
    // fallback: map unknown -> no_tumor (safer default for UI)
    return BRAIN_DISEASES['no_tumor']
} 
