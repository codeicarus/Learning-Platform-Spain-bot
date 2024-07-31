import mongoose from "mongoose";
import { Context, NarrowedContext } from "telegraf";
import {
  CallbackQuery,
  Message,
  Update,
} from "telegraf/typings/core/types/typegram";

export interface IGroupType {
  id: number;
  title: string;
  is_forum?: boolean;
  db?: string;
  type?: string;
}

export interface IGroupTypeDB {
  [key: string]: IGroupType;
}

export type CTX = NarrowedContext<
  Context<Update>,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }
>;

export type CTXActions = NarrowedContext<
  Context<Update> & {
    match: RegExpExecArray;
  },
  Update.CallbackQueryUpdate<CallbackQuery>
>;

export interface IAreaSchema {
  _id: mongoose.Types.ObjectId;
  name: string;
}

export interface ITimeTask {
  close: number;
  open: string;
}

export const temas: IGroupTypeDB = {
  "derecho administrativo y función pública": {
    id: 471,
    title: "Función Pública",
  },
  "conducta humana": {
    id: 505,
    title: "Conducta Humana",
  },
  "derecho penal": {
    id: 503,
    title: "Derecho Penal",
  },
  "derecho penitenciario": {
    id: 501,
    title: "Derecho Penitenciario - Test",
  },
  oficial: {
    id: 509,
    title: "Preguntas Oficiales",
  },
  publico: {
    id: 507,
    title: "Ley Contratos Públicos",
  },
};
