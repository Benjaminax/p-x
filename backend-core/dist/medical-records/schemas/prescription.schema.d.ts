import { Document, Schema as MongooseSchema } from 'mongoose';
export declare enum PrescriptionStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    EXPIRED = "expired"
}
export declare enum Frequency {
    ONCE_DAILY = "once_daily",
    TWICE_DAILY = "twice_daily",
    THREE_TIMES_DAILY = "three_times_daily",
    FOUR_TIMES_DAILY = "four_times_daily",
    AS_NEEDED = "as_needed",
    WEEKLY = "weekly",
    CUSTOM = "custom"
}
export declare class Medication {
    name: string;
    dosage: string;
    frequency: Frequency;
    customFrequency?: string;
    startDate: Date;
    endDate?: Date;
    instructions?: string;
    sideEffects?: string[];
    adherencePercentage?: number;
}
export declare class Prescription extends Document {
    patientId: MongooseSchema.Types.ObjectId;
    doctorId: MongooseSchema.Types.ObjectId;
    medications: Medication[];
    prescriptionDate: Date;
    status: PrescriptionStatus;
    notes?: string;
    diagnosis?: string;
    attachments?: string[];
    refillsRemaining?: number;
    pharmacyName?: string;
    pharmacyPhone?: string;
    digitalSignature?: string;
    isVerified: boolean;
}
export declare const PrescriptionSchema: MongooseSchema<Prescription, import("mongoose").Model<Prescription, any, any, any, (Document<unknown, any, Prescription, any, import("mongoose").DefaultSchemaOptions> & Prescription & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Prescription, any, import("mongoose").DefaultSchemaOptions> & Prescription & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, Prescription>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Prescription, Document<unknown, {}, Prescription, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    doctorId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<PrescriptionStatus, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    medications?: import("mongoose").SchemaDefinitionProperty<Medication[], Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    prescriptionDate?: import("mongoose").SchemaDefinitionProperty<Date, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string | undefined, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    diagnosis?: import("mongoose").SchemaDefinitionProperty<string | undefined, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    attachments?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    refillsRemaining?: import("mongoose").SchemaDefinitionProperty<number | undefined, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pharmacyName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    pharmacyPhone?: import("mongoose").SchemaDefinitionProperty<string | undefined, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    digitalSignature?: import("mongoose").SchemaDefinitionProperty<string | undefined, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isVerified?: import("mongoose").SchemaDefinitionProperty<boolean, Prescription, Document<unknown, {}, Prescription, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Prescription & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Prescription>;
