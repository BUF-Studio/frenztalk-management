export interface Meeting {

    start: string,
    duration: number,
}


export interface ZoomAccount {
    id: string | null,
    email: string,
    clientid: string,
    clientsecret: string,
    accountid: string,
    meetings: Meeting[],
}

   