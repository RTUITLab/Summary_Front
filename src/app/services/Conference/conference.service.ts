import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConferenceService {
  conferenceId: string;
  hostId: string;
  conferenceName: string;
  participantId: string;

  constructor(private http: HttpClient) { }

  public async createConference(conferenceName: string, hostName: string): Promise<ConferenceCreatedModel> {
    try {
      let request = await this.http.post<ConferenceCreatedModel>(environment.conferenceApiUrl +
        `create?conference_name=${conferenceName}&host_name=${hostName}`, {}).toPromise();

      if (request.success) {
        this.conferenceId = request.conferenceId;
        this.conferenceName = request.conferenceName;
        this.hostId = request.hostId;
        return request;
      }
    } catch (error) {

    }

    return null;
  }

  public async joinToConference(conferenceId: string, speakerName: string): Promise<ConferenceParticipantJoinModel> {
    try {
      let request = await this.http.post<ConferenceParticipantJoinModel>(environment.conferenceApiUrl +
        `join_speaker?conference_id=${conferenceId}&speaker_name=${speakerName}`, {}).toPromise();

      if (request.success) {
        this.conferenceId = request.conferenceId;
        this.conferenceName = request.conferenceName;
        this.hostId = request.hostId;
        this.participantId = request.participantId;
        return request;
      }
    } catch (error) {

    }

    return null;
  }

  public async sendChunkToConference(conferenceId: string, participantId: string, blob: Blob): Promise<ConferenceTranscripts[]> {
    try {
      let request = await this.http.post<ConferenceSendChunkModel>(environment.conferenceApiUrl +
        `chunk?conference_id=${conferenceId}&participant_id=${participantId}`, blob).toPromise();
      if (request.success) {
        return request.transcripts;
      }
    } catch (error) {

    }

    return null;
  }

  public async endConference(conferenceId: string): Promise<boolean> {
    try {
      let request: any = await this.http.post(environment.conferenceApiUrl +
        `finish?conference_id=${conferenceId}`, {}).toPromise();

      if (request.success) {
        return true;
      }
    } catch (error) {

    }

    return null;
  }

  public async getConferenceText(conferenceId: string, format: string = "json"): Promise<string> {
    try {
      let request: any = await this.http.get(environment.conferenceApiUrl +
        `download?conference_id=${conferenceId}&format=${format}`).toPromise();

      if (format === "json") {
        if (request.success) {
          return request.text;
        }
      } else {
        return request;
      }
    } catch (error) {

    }

    return null;
  }

  public clearConference(): void {
    this.conferenceId = "";
    this.hostId = "";
    this.conferenceName = "";
    this.participantId = "";
  }

  public isInConference(): boolean {
    return !!this.conferenceId &&
      (!!this.hostId || !!this.participantId) &&
      !!this.conferenceName;
  }
}

export type ConferenceCreatedModel = {
  conferenceId: string,
  conferenceName: string,
  hostId: string,
  success: boolean
}

export type ConferenceParticipantJoinModel = {
  conferenceId: string,
  conferenceName: string,
  hostId: string,
  participantId: string,
  success: boolean
}

export type ConferenceSendChunkModel = {
  success: boolean,
  transcripts: ConferenceTranscripts[]
}

export type ConferenceTranscripts = {
  participantId: string,
  participantName: string,
  isFinal: boolean,
  value: string,
  confidence: number
}