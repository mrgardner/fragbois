import {FileReaderEventTarget} from "./fileReaderEventTarget.interface";

export interface FileReaderEvent extends Event {
  target: FileReaderEventTarget;
  getMessage():string;
}
