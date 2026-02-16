// Brain Diseases Reference Database
export const BRAIN_DISEASES = {
    'Tumor': {
        fullName: 'Brain Tumor',
        types: ['Glioblastoma', 'Meningioma', 'Astrocytoma', 'Pituitary Adenoma', 'Medulloblastoma'],
        symptoms: ['Persistent headaches', 'Seizures', 'Vision problems', 'Balance difficulties', 'Personality changes', 'Nausea and vomiting'],
        imagingFindings: ['Mass lesion with irregular borders', 'Surrounding edema', 'Contrast enhancement', 'Mass effect on adjacent structures'],
        riskFactors: ['Radiation exposure', 'Family history', 'Immune system disorders', 'Age (more common in adults)'],
        treatment: [
            'Surgical resection (tumor removal)',
            'Radiation therapy (targeted beam therapy)',
            'Chemotherapy (Temozolomide, Carmustine)',
            'Targeted drug therapy',
            'Immunotherapy',
            'Palliative care for symptom management'
        ],
        severity: 'high'
    },
    'Stroke': {
        fullName: 'Cerebrovascular Accident (Stroke)',
        types: ['Ischemic Stroke', 'Hemorrhagic Stroke', 'Transient Ischemic Attack (TIA)'],
        symptoms: ['Sudden numbness or weakness', 'Confusion', 'Trouble speaking', 'Vision problems', 'Severe headache', 'Loss of balance'],
        imagingFindings: ['Hypodense area (ischemic)', 'Hyperdense area (hemorrhage)', 'Midline shift', 'Mass effect'],
        riskFactors: ['Hypertension', 'Diabetes', 'High cholesterol', 'Smoking', 'Obesity', 'Age over 55'],
        treatment: [
            'Emergency: tPA (tissue plasminogen activator) for ischemic stroke within 4.5 hours',
            'Mechanical thrombectomy',
            'Blood pressure management',
            'Antiplatelet therapy (Aspirin, Clopidogrel)',
            'Anticoagulation therapy',
            'Rehabilitation therapy (physical, occupational, speech)'
        ],
        severity: 'high'
    },
    'Alzheimer': {
        fullName: "Alzheimer's Disease",
        types: ['Early-onset Alzheimer\'s', 'Late-onset Alzheimer\'s', 'Familial Alzheimer\'s'],
        symptoms: ['Memory loss', 'Difficulty planning', 'Confusion with time/place', 'Language problems', 'Poor judgment', 'Personality changes'],
        imagingFindings: ['Hippocampal atrophy', 'Cortical thinning', 'Ventricular enlargement', 'Reduced glucose metabolism (PET)'],
        riskFactors: ['Age over 65', 'Family history', 'APOE-e4 gene', 'Head trauma', 'Cardiovascular disease'],
        treatment: [
            'Cholinesterase inhibitors (Donepezil, Rivastigmine, Galantamine)',
            'NMDA antagonist (Memantine)',
            'Aducanumab (amyloid-targeting therapy)',
            'Cognitive therapy and mental stimulation',
            'Lifestyle modifications (diet, exercise, social engagement)',
            'Caregiver support and patient safety measures'
        ],
        severity: 'medium'
    },
    'Multiple Sclerosis': {
        fullName: 'Multiple Sclerosis (MS)',
        types: ['Relapsing-Remitting MS', 'Primary Progressive MS', 'Secondary Progressive MS', 'Progressive-Relapsing MS'],
        symptoms: ['Fatigue', 'Vision problems', 'Numbness/tingling', 'Muscle weakness', 'Balance problems', 'Bladder dysfunction'],
        imagingFindings: ['Multiple white matter lesions', 'Periventricular plaques', 'Dawson\'s fingers pattern', 'Contrast-enhancing lesions (active)'],
        riskFactors: ['Age 20-40', 'Female gender', 'Family history', 'Vitamin D deficiency', 'Smoking', 'Certain infections'],
        treatment: [
            'Disease-modifying therapies (Interferon beta, Glatiramer acetate)',
            'Monoclonal antibodies (Natalizumab, Ocrelizumab)',
            'Oral medications (Fingolimod, Dimethyl fumarate)',
            'Corticosteroids for acute relapses',
            'Symptom management (muscle relaxants, pain medications)',
            'Physical therapy and rehabilitation'
        ],
        severity: 'medium'
    },
    'Traumatic Brain Injury': {
        fullName: 'Traumatic Brain Injury (TBI)',
        types: ['Concussion', 'Contusion', 'Diffuse Axonal Injury', 'Penetrating Injury'],
        symptoms: ['Loss of consciousness', 'Headache', 'Confusion', 'Dizziness', 'Memory problems', 'Mood changes'],
        imagingFindings: ['Skull fracture', 'Intracranial hemorrhage', 'Contusions', 'Brain swelling', 'Midline shift'],
        riskFactors: ['Motor vehicle accidents', 'Falls', 'Sports injuries', 'Violence', 'Military combat'],
        treatment: [
            'Emergency stabilization and monitoring',
            'Surgical intervention (craniotomy for hematoma evacuation)',
            'Intracranial pressure monitoring',
            'Medications to prevent seizures',
            'Cognitive rehabilitation therapy',
            'Rest and gradual return to activities'
        ],
        severity: 'high'
    },
    'Hemorrhage': {
        fullName: 'Intracranial Hemorrhage',
        types: ['Epidural Hematoma', 'Subdural Hematoma', 'Subarachnoid Hemorrhage', 'Intraparenchymal Hemorrhage'],
        symptoms: ['Severe sudden headache', 'Neck stiffness', 'Nausea/vomiting', 'Altered consciousness', 'Seizures'],
        imagingFindings: ['Hyperdense area on CT', 'Blood in ventricles/subarachnoid space', 'Mass effect', 'Midline shift'],
        riskFactors: ['Hypertension', 'Aneurysm', 'Trauma', 'Blood thinners', 'Vascular malformations'],
        treatment: [
            'Emergency neurosurgical consultation',
            'Surgical evacuation of hematoma',
            'Aneurysm clipping or coiling',
            'Blood pressure control',
            'Reversal of anticoagulation',
            'Intensive care monitoring'
        ],
        severity: 'high'
    },
    'Epilepsy': {
        fullName: 'Epilepsy',
        types: ['Focal Seizures', 'Generalized Seizures', 'Absence Seizures', 'Tonic-Clonic Seizures'],
        symptoms: ['Recurrent seizures', 'Temporary confusion', 'Staring spells', 'Uncontrollable jerking', 'Loss of consciousness'],
        imagingFindings: ['Structural lesions (tumors, malformations)', 'Hippocampal sclerosis', 'Cortical dysplasia', 'Often normal imaging'],
        riskFactors: ['Family history', 'Head trauma', 'Stroke', 'Brain infections', 'Developmental disorders'],
        treatment: [
            'Antiepileptic drugs (Levetiracetam, Valproic acid, Carbamazepine)',
            'Ketogenic diet',
            'Vagus nerve stimulation',
            'Responsive neurostimulation',
            'Surgical resection of seizure focus',
            'Lifestyle modifications and trigger avoidance'
        ],
        severity: 'medium'
    },
    'Atrophy': {
        fullName: 'Brain Atrophy',
        types: ['Generalized Atrophy', 'Focal Atrophy', 'Cortical Atrophy', 'Cerebellar Atrophy'],
        symptoms: ['Cognitive decline', 'Memory problems', 'Motor coordination issues', 'Speech difficulties'],
        imagingFindings: ['Reduced brain volume', 'Widened sulci', 'Enlarged ventricles', 'Thinned cortex'],
        riskFactors: ['Aging', 'Neurodegenerative diseases', 'Chronic alcohol use', 'Malnutrition', 'Infections'],
        treatment: [
            'Treat underlying cause',
            'Cognitive rehabilitation',
            'Physical therapy',
            'Nutritional support',
            'Medications for associated symptoms',
            'Neuroprotective strategies (under research)'
        ],
        severity: 'medium'
    },
    'Normal': {
        fullName: 'Normal Brain Scan',
        types: ['Age-appropriate changes', 'Benign findings'],
        symptoms: ['No significant abnormalities'],
        imagingFindings: ['Normal brain parenchyma', 'No mass lesions', 'Normal ventricles', 'No hemorrhage or infarction'],
        riskFactors: ['N/A'],
        treatment: [
            'No treatment required',
            'Routine health monitoring',
            'Healthy lifestyle maintenance',
            'Regular check-ups as recommended'
        ],
        severity: 'low'
    }
}

export const getDiseaseInfo = (diagnosisText) => {
    if (!diagnosisText) return null

    // Find matching disease by checking if diagnosis contains key terms
    for (const [key, disease] of Object.entries(BRAIN_DISEASES)) {
        if (diagnosisText.toLowerCase().includes(key.toLowerCase())) {
            return disease
        }
    }

    // Default to a generic object if partially matched or unknown, or return null
    return {
        fullName: diagnosisText,
        types: [],
        symptoms: [],
        imagingFindings: [],
        riskFactors: [],
        treatment: ['Consult a specialist'],
        severity: 'unknown'
    }
}
