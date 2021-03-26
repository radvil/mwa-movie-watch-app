export interface Movie {
  id: string;
  title: string;
  episodes: number;
  info_url: string;
  watch_url: string;
}

export class MovieDto {
  public title!: string;
  public episodes!: number;
  public info_url!: string;
  public watch_url!: string;
}