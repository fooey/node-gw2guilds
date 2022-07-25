export interface IApiGuild {
  id: string;
  name: string;
  tag: string;
  emblem?: IApiGuildEmblem;
}

export interface IApiGuildEmblem {
  background: IApiGuildEmblemLayer;
  foreground: IApiGuildEmblemLayer;
  flags: string[];
}

export interface IApiGuildEmblemLayer {
  id: number;
  colors: number[];
}
