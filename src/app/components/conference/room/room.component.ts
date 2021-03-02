import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConferenceService } from 'src/app/services/Conference/conference.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  conferenceId: string;
  hostId: string;
  conferenceName: string;
  participantId: string;
  isHost: boolean;

  conferenceStarted: boolean;
  linkToConnect: string;

  recId: any;
  recorder: any;

  trans: any[];
  constructor(private conferenceService: ConferenceService) { }

  async ngOnInit(): Promise<void> {
    this.conferenceStarted = true;
    this.linkToConnect = "";
    if (!this.conferenceService.isInConference()) {
      console.log(this.conferenceService.isInConference());

      this.conferenceStarted = false;
      return;
    }
    this.conferenceId = this.conferenceService.conferenceId;
    this.hostId = this.conferenceService.hostId;
    this.conferenceName = this.conferenceService.conferenceName;
    this.participantId = this.conferenceService.participantId ? this.conferenceService.participantId : this.conferenceService.hostId;
    this.isHost = this.hostId === this.participantId;

    let micro = await navigator.mediaDevices.getUserMedia({ audio: true });

    let audio = document.querySelector("audio");
    audio.srcObject = micro;

    let finalTranscriptList = [];
    let interimTranscriptMap = {};

    this.recorder = new RecordRTC(micro, {
      type: 'audio',
      // @ts-ignore
      recorderType: StereoAudioRecorder,
      mimeType: 'audio/wav',
      timeSlice: 500,
      desiredSampRate: 16000,
      bufferSize: 8192,
      numberOfAudioChannels: 1,
      ondataavailable: async (blob) => {
        console.log(URL.createObjectURL(blob));
        let trans = await this.conferenceService.sendChunkToConference(this.conferenceId, this.participantId, blob);
        console.log(`trans = ${trans}`);
        if (trans !== null) {

          trans.forEach(t => {
            if (t.isFinal) {
              finalTranscriptList.push(t);
              delete interimTranscriptMap[t.participantId];
            } else {
              interimTranscriptMap[t.participantId] = t;
            }
          })
          if (finalTranscriptList.length > 10) {
            finalTranscriptList.splice(0, finalTranscriptList.length - 10);
          }

          this.trans = [];
          finalTranscriptList.forEach(t => {
            this.trans.push({
              style: "color: green;",
              name: t.participantName,
              value: t.value
            });
          })

          for (var participantId in interimTranscriptMap) {
            var t = interimTranscriptMap[participantId];
            this.trans.push({
              style: "color: red;",
              name: t.participantName,
              value: t.value
            });
          }
        }
      }
    });
    this.recorder.startRecording();
    // release microphone on stopRecording
    this.recorder.microphone = micro;

    this.linkToConnect = window.location.origin +
      `/connect/conference/${this.conferenceId}`;
  }

  async end(): Promise<void> {
    this.clearRecords();
    this.conferenceStarted = !(await this.conferenceService.endConference(this.conferenceId, this.isHost));
  }

  async ngOnDestroy(): Promise<void> {
    await this.end();
  }

  clearRecords(): void {
    if (this.recorder) {
      this.recorder.stopRecording();
      this.recorder.microphone.stop();
    }
    if (this.recId) {
      clearInterval(this.recId);
    }
  }
}

declare var RecordRTC: any;