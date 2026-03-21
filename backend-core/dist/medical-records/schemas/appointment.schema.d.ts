import { Document, Schema as MongooseSchema } from 'mongoose';
export declare enum AppointmentStatus {
    SCHEDULED = "scheduled",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show",
    RESCHEDULED = "rescheduled"
}
export declare enum AppointmentType {
    IN_PERSON = "in_person",
    TELEMEDICINE = "telemedicine",
    PHONE = "phone",
    EMERGENCY = "emergency",
    FOLLOW_UP = "follow_up",
    ROUTINE_CHECKUP = "routine_checkup"
}
export declare enum Department {
    CARDIOLOGY = "cardiology",
    NEUROLOGY = "neurology",
    ORTHOPEDICS = "orthopedics",
    PEDIATRICS = "pediatrics",
    GENERAL_PRACTICE = "general_practice",
    DERMATOLOGY = "dermatology",
    PSYCHIATRY = "psychiatry",
    RADIOLOGY = "radiology",
    EMERGENCY = "emergency"
}
export declare class Appointment extends Document {
    patientId: MongooseSchema.Types.ObjectId;
    doctorId: MongooseSchema.Types.ObjectId;
    scheduledDate: Date;
    scheduledTime: string;
    duration?: number;
    status: AppointmentStatus;
    type: AppointmentType;
    department?: Department;
    reason: string;
    symptoms?: string;
    attachedDocuments?: string[];
    hospitalName?: string;
    roomNumber?: string;
    address?: string;
    meetingLink?: string;
    meetingId?: string;
    patientNotes?: string;
    doctorNotes?: string;
    isFollowUp?: boolean;
    previousAppointmentId?: MongooseSchema.Types.ObjectId;
    nextAppointmentId?: MongooseSchema.Types.ObjectId;
    reminderSent?: boolean;
    reminderDates?: Date[];
    estimatedCost?: number;
    currency?: string;
    isPaid?: boolean;
    cancellationReason?: string;
    cancelledBy?: string;
    cancelledAt?: Date;
}
export declare const AppointmentSchema: MongooseSchema<Appointment, import("mongoose").Model<Appointment, any, any, any, (Document<unknown, any, Appointment, any, import("mongoose").DefaultSchemaOptions> & Appointment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Appointment, any, import("mongoose").DefaultSchemaOptions> & Appointment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}), any, Appointment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Appointment, Document<unknown, {}, Appointment, {
    id: string;
}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<AppointmentType, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    doctorId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<AppointmentStatus, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    symptoms?: import("mongoose").SchemaDefinitionProperty<string | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scheduledDate?: import("mongoose").SchemaDefinitionProperty<Date, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scheduledTime?: import("mongoose").SchemaDefinitionProperty<string, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    duration?: import("mongoose").SchemaDefinitionProperty<number | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    department?: import("mongoose").SchemaDefinitionProperty<Department | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reason?: import("mongoose").SchemaDefinitionProperty<string, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    attachedDocuments?: import("mongoose").SchemaDefinitionProperty<string[] | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    hospitalName?: import("mongoose").SchemaDefinitionProperty<string | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    roomNumber?: import("mongoose").SchemaDefinitionProperty<string | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    address?: import("mongoose").SchemaDefinitionProperty<string | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    meetingLink?: import("mongoose").SchemaDefinitionProperty<string | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    meetingId?: import("mongoose").SchemaDefinitionProperty<string | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    patientNotes?: import("mongoose").SchemaDefinitionProperty<string | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    doctorNotes?: import("mongoose").SchemaDefinitionProperty<string | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isFollowUp?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    previousAppointmentId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    nextAppointmentId?: import("mongoose").SchemaDefinitionProperty<MongooseSchema.Types.ObjectId | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reminderSent?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    reminderDates?: import("mongoose").SchemaDefinitionProperty<Date[] | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    estimatedCost?: import("mongoose").SchemaDefinitionProperty<number | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currency?: import("mongoose").SchemaDefinitionProperty<string | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isPaid?: import("mongoose").SchemaDefinitionProperty<boolean | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cancellationReason?: import("mongoose").SchemaDefinitionProperty<string | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cancelledBy?: import("mongoose").SchemaDefinitionProperty<string | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cancelledAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Appointment, Document<unknown, {}, Appointment, {
        id: string;
    }, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & Omit<Appointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Appointment>;
