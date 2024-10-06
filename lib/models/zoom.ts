

export class Meeting {
    constructor(
        public start: string,
        public duration: number,
        public meetingId: string,
    ) { }

    static fromMap(data: Record<string, any>): Meeting {
        return new Meeting(
            data.start,
            data.duration,
            data.meetingId,
        );
    }

    toMap(): Record<string, any> {
        return {
            start: this.start,
            duration: this.duration,
            meetingId: this.meetingId,
        };
    }
}

export class ZoomAccount {
    constructor(
        public id: string | null,
        public email: string,
        public clientid: string,
        public clientsecret: string,
        public accountid: string,
        public meetings: Meeting[],
    ) { }


    static fromMap(data: Record<string, any>, id: string): ZoomAccount {
        console.log('data.meeting')
        console.log(data.meetings)
        const meet: Meeting[] = data.meetings?.map((meetingData: Record<string, any>) => Meeting.fromMap(meetingData))??[];
        return new ZoomAccount(
            id,
            data.email,
            data.clientid,
            data.clientsecret,
            data.accountid,
            meet,
        );
    }

    toMap(): Record<string, any> {
        return {
            email: this.email,
            clientid: this.clientid,
            clientsecret: this.clientsecret,
            accountid: this.accountid,
            meetings: this.meetings.map(meeting => meeting.toMap()),
        };
    }
}