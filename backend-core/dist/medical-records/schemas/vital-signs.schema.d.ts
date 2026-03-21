import { Document, Schema as MongooseSchema } from 'mongoose';
export declare class BloodPressure {
    systolic: number;
    diastolic: number;
    unit: string;
}
export declare class VitalSigns extends Document {
    patientId: MongooseSchema.Types.ObjectId;
    recordedAt: Date;
    bloodPressure?: BloodPressure;
    heartRate?: number;
    temperature?: number;
    temperatureUnit?: string;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    weight?: number;
    weightUnit?: string;
    height?: number;
    heightUnit?: string;
    bmi?: number;
    bloodGlucose?: number;
    glucoseUnit?: string;
    painLevel?: number;
    notes?: string;
    recordedBy?: MongooseSchema.Types.ObjectId;
    location?: string;
    symptoms?: string[];
    aiInsights?: string;
    alerts?: string[];
}
export declare const VitalSignsSchema: MongooseSchema<VitalSigns, import("mongoose").Model<VitalSigns, any, any, any, (Document<unknown, any, VitalSigns, any, import("mongoose").DefaultSchemaOptions> & VitalSigns & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, VitalSigns, any, import("mongoose").DefaultSchemaOptions> & VitalSigns & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, VitalSigns>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VitalSigns, Document<unknown, {}, VitalSigns, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    notes?: import("mongoose").SchemaDefinitionProperty<string | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recordedAt?: import("mongoose").SchemaDefinitionProperty<Date, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bloodPressure?: import("mongoose").SchemaDefinitionProperty<BloodPressure | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    heartRate?: import("mongoose").SchemaDefinitionProperty<number | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    temperature?: import("mongoose").SchemaDefinitionProperty<number | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    temperatureUnit?: import("mongoose").SchemaDefinitionProperty<string | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    respiratoryRate?: import("mongoose").SchemaDefinitionProperty<number | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    oxygenSaturation?: import("mongoose").SchemaDefinitionProperty<number | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weight?: import("mongoose").SchemaDefinitionProperty<number | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    weightUnit?: import("mongoose").SchemaDefinitionProperty<string | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    height?: import("mongoose").SchemaDefinitionProperty<number | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    heightUnit?: import("mongoose").SchemaDefinitionProperty<string | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bmi?: import("mongoose").SchemaDefinitionProperty<number | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bloodGlucose?: import("mongoose").SchemaDefinitionProperty<number | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    glucoseUnit?: import("mongoose").SchemaDefinitionProperty<string | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    painLevel?: import("mongoose").SchemaDefinitionProperty<number | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recordedBy?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<string | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    symptoms?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    aiInsights?: import("mongoose").SchemaDefinitionProperty<string | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    alerts?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, VitalSigns, Document<unknown, {}, VitalSigns, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<VitalSigns & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, VitalSigns>;
