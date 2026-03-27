export interface SoapNote {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;

    vitals?: {
        bloodPressure?: string;
        heartRate?: string;
        temperature?: string;
        respiratoryRate?: string;
    };

    rangeOfMotion?: string;
    diagnosis?: string[];

    medications?: {
        name: string;
        dosage?: string;
        frequency?: string;
    }[];
}