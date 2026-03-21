import { Document, Schema as MongooseSchema } from 'mongoose';
export declare enum AllergySeverity {
    MILD = "mild",
    MODERATE = "moderate",
    SEVERE = "severe",
    LIFE_THREATENING = "life-threatening"
}
export declare class Allergy extends Document {
    patientId: MongooseSchema.Types.ObjectId;
    allergen: string;
    reaction?: string;
    severity: AllergySeverity;
    verifiedByLab: boolean;
    deletedAt?: Date;
}
export declare const AllergySchema: MongooseSchema<Allergy, import("mongoose").Model<Allergy, any, any, any, (Document<unknown, any, Allergy, any, import("mongoose").DefaultSchemaOptions> & Allergy & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Allergy, any, import("mongoose").DefaultSchemaOptions> & Allergy & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, Allergy>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Allergy, Document<unknown, {}, Allergy, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Allergy & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Allergy, Document<unknown, {}, Allergy, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Allergy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, Allergy, Document<unknown, {}, Allergy, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Allergy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    severity?: import("mongoose").SchemaDefinitionProperty<AllergySeverity, Allergy, Document<unknown, {}, Allergy, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Allergy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    allergen?: import("mongoose").SchemaDefinitionProperty<string, Allergy, Document<unknown, {}, Allergy, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Allergy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reaction?: import("mongoose").SchemaDefinitionProperty<string | undefined, Allergy, Document<unknown, {}, Allergy, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Allergy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    verifiedByLab?: import("mongoose").SchemaDefinitionProperty<boolean, Allergy, Document<unknown, {}, Allergy, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Allergy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    deletedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Allergy, Document<unknown, {}, Allergy, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Allergy & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Allergy>;
