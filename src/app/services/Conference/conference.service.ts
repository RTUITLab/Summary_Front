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
      let request: any = await this.http.post(environment.conferenceApiUrl +
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
      let request: any = await this.http.post(environment.conferenceApiUrl +
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
      
      if (request.success) {
        return request.text;
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