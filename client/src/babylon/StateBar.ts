// shows game state (kills and collected puppies) in the top-left corner
import * as GUI from "babylonjs-gui";
import Player from "../model/Player";
import { UIManager } from "./UIManager";

class StateBar {
  private ui: UIManager;
  private panel:GUI.StackPanel;
  private basePathUi = 'ui';
  private puppyText: GUI.TextBlock;
  private killText: GUI.TextBlock;

  constructor(ui: UIManager) {
    this.ui = ui;
    this.panel = new GUI.StackPanel();
    this.puppyText = this.createText('0', 80)
    this.killText = this.createText('0', 80)
    this.createPanel()
  }

  createPanel() {
    const width = 80*2+48*2;
    const imgDim = '48px';

    this.panel.width = `${width}px`;
    this.panel.isVertical = false;
    this.panel.background = 'grey';
    this.panel.top = 0;
    this.panel.left = 0;
    this.panel.alpha = 1;
    this.panel.height = imgDim;
    this.panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

    const puppyImage = new GUI.Image('puppy', 
    `/${this.basePathUi}/puppy.png`);
    puppyImage.width = imgDim;
    puppyImage.height = imgDim;
    this.panel.addControl(puppyImage)
    this.panel.addControl(this.puppyText)

    const skullImage = new GUI.Image('skull', 
    `/${this.basePathUi}/skull.png`);
    skullImage.width = imgDim;
    skullImage.height = imgDim;
    this.panel.addControl(skullImage)
    this.panel.addControl(this.killText)

    this.ui.addControl(this.panel);
  }

  private createText(txt:string, width: number) {
    let text = new GUI.TextBlock(txt)
    text.text = txt;
    text.color = 'blue';
    text.height = '48px';
    text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    text.width = `${width}px`;
    return text;
  }

  update(playerModel: Player) {
    this.puppyText.text = playerModel.dogs.toFixed(0)
    this.killText.text = playerModel.kill.toFixed(0)
  }
}

export default StateBar;