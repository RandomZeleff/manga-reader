import { EmbedBuilder } from "discord.js";

class Pagination {
  private pages: EmbedBuilder[];
  private index: number = 0;

  constructor(embeds: EmbedBuilder[]) {
    this.pages = embeds;
  }

  next() {
    if (this.index === this.pages.length - 1) this.index = 0;
    else this.index++;

    return this.current();
  }

  previous() {
    if (this.index === 0) this.index = this.pages.length - 1;
    else this.index--;

    return this.current();
  }

  current() {
    return this.pages[this.index];
  }
}

export default Pagination;
