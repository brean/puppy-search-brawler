// show big "YOU WON!" or "YOU LOST"

import * as GUI from "babylonjs-gui";
import { UIManager } from "./UIManager";

export default class WonLostText {
  private text: GUI.TextBlock;
  private last: number = 0;

  constructor(ui: UIManager) {
    this.text = new GUI.TextBlock();
    this.text.color = 'red';
    this.text.fontSize = '72px'
    this.text.height = '72px';
    this.text.width = `400px`;
    this.text.text = 'YOU LOST!';
    this.text.alpha = 0.0
    this.text.isVisible = false;
    ui.addControl(this.text);
  }
  
  hide() {
    this.text.isVisible = false;
  }

  update() {
    if (this.last && this.text.isVisible) {
      if (new Date().getTime()/1000  - this.last > 2) {
        this.text.alpha -= .01;
      }
      if (this.text.alpha <= 0) {
        this.text.alpha = 0
        this.text.isVisible = false;
      }
    }
  }

  show(won: boolean) {
    this.last = new Date().getTime()/1000 ;
    if (won) {
      this.text.text = 'YOU WON!';
    } else {
      this.text.text = 'YOU LOST!';
    }
    this.text.alpha = 1
    this.text.isVisible = true;
  }
}