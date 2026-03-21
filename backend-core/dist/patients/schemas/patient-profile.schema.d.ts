import { Document, Schema as MongooseSchema } from 'mongoose';
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare enum BloodType {
    A_POS = "A+",
    A_NEG = "A-",
    B_POS = "B+",
    B_NEG = "B-",
    AB_POS = "AB+",
    AB_NEG = "AB-",
    O_POS = "O+",
    O_NEG = "O-"
}
export declare enum Genotype {
    AA = "AA",
    AS = "AS",
    SS = "SS",
    AC = "AC",
    SC = "SC"
}
export declare class PatientProfile extends Document {
    userId: MongooseSchema.Types.ObjectId;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: Gender;
    bloodType?: BloodType;
    genotype?: Genotype;
    heightCm?: number;
    weightKg?: number;
    profilePhotoUrl?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    healthInsuranceProvider?: string;
    healthInsuranceNumber?: string;
    insuranceCardUrl?: string;
    qrCodeUrl?: string;
    isOfflineSyncEnabled: boolean;
    deletedAt?: Date;
}
export declare const PatientProfileSchema: MongooseSchema<PatientProfile, import("mongoose").Model<PatientProfile, any, any, any, (Document<unknown, any, PatientProfile, any, import("mongoose").DefaultSchemaOptions> & PatientProfile & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, PatientProfile, any, import("mongoose").DefaultSchemaOptions> & PatientProfile & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, PatientProfile>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PatientProfile, Document<unknown, {}, PatientProfile, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    firstName?: import("mongoose").SchemaDefinitionProperty<string, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastName?: import("mongoose").SchemaDefinitionProperty<string, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dateOfBirth?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gender?: import("mongoose").SchemaDefinitionProperty<Gender | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bloodType?: import("mongoose").SchemaDefinitionProperty<BloodType | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    genotype?: import("mongoose").SchemaDefinitionProperty<Genotype | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    heightCm?: import("mongoose").SchemaDefinitionProperty<number | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weightKg?: import("mongoose").SchemaDefinitionProperty<number | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    profilePhotoUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    emergencyContactName?: import("mongoose").SchemaDefinitionProperty<string | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    emergencyContactPhone?: import("mongoose").SchemaDefinitionProperty<string | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    healthInsuranceProvider?: import("mongoose").SchemaDefinitionProperty<string | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    healthInsuranceNumber?: import("mongoose").SchemaDefinitionProperty<string | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    insuranceCardUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qrCodeUrl?: import("mongoose").SchemaDefinitionProperty<string | undefined, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isOfflineSyncEnabled?: import("mongoose").SchemaDefinitionProperty<boolean, PatientProfile, Document<unknown, {}, PatientProfile, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<PatientProfile & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PatientProfile>;
