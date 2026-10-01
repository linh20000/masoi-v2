/**
 * Mock Step Call WebSocket Server / Local Event Dispatcher
 * Simulates real-time multiplayer Step Call queue & room synchronization
 */

import { StepCallEngine, PlayerState, StepCallQueueItem } from './stepCallEngine';
import { CardSet, TimeoutPolicy } from './stepCallSchema';

export type GamePhase = 'LOBBY' | 'NIGHT_STEP_CALL' | 'DAY_DISCUSSION' | 'DAY_VOTING' | 'GAME_OVER';

export interface RoomState {
  roomId: string;
  hostId: string;
  activeCardSets: CardSet[];
  phase: GamePhase;
  nightIndex: number;
  players: PlayerState[];
  currentStepIndex: number;
  currentStep?: StepCallQueueItem;
  logs: string[];
}

export type RoomEventCallback = (event: string, payload: any) => void;

export class MockStepCallServer {
  private room: RoomState;
  private engine: StepCallEngine;
  private listeners: RoomEventCallback[];
  private stepTimer: any;

  constructor(roomId: string = '8921', hostId: string = 'p7') {
    this.engine = new StepCallEngine(['BASIC', 'CHARACTER']);
    this.listeners = [];
    this.stepTimer = null;

    this.room = {
      roomId,
      hostId,
      activeCardSets: ['BASIC', 'CHARACTER'],
      phase: 'LOBBY',
      nightIndex: 1,
      players: [
        { id: 'p1', seatNum: 'I', roleId: 'villager', isAlive: true },
        { id: 'p2', seatNum: 'II', roleId: 'defender', isAlive: true },
        { id: 'p3', seatNum: 'III', roleId: 'villager', isAlive: true },
        { id: 'p4', seatNum: 'IV', roleId: 'hunter', isAlive: true },
        { id: 'p5', seatNum: 'V', roleId: 'villager', isAlive: true },
        { id: 'p6', seatNum: 'VI', roleId: 'werewolf', isAlive: true },
        { id: 'p7', seatNum: 'VII', roleId: 'seer', isAlive: true },
        { id: 'p8', seatNum: 'VIII', roleId: 'witch', isAlive: true },
        { id: 'p9', seatNum: 'IX', roleId: 'villager', isAlive: true },
        { id: 'p10', seatNum: 'X', roleId: 'white_werewolf', isAlive: true },
        { id: 'p11', seatNum: 'XI', roleId: 'cupid', isAlive: true },
        { id: 'p12', seatNum: 'XII', roleId: 'villager', isAlive: true },
      ],
      currentStepIndex: -1,
      logs: ['Phòng #8921 được khởi tạo.'],
    };
  }

  public subscribe(callback: RoomEventCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private broadcast(event: string, payload: any) {
    this.listeners.forEach((listener) => listener(event, payload));
  }

  public setCardSets(cardSets: CardSet[]) {
    this.room.activeCardSets = cardSets;
    this.engine = new StepCallEngine(cardSets);
    this.broadcast('ROOM_UPDATED', this.room);
  }

  public startNightPhase() {
    this.room.phase = 'NIGHT_STEP_CALL';
    const queue = this.engine.buildNightQueue(this.room.players, this.room.nightIndex);
    this.room.currentStepIndex = 0;
    this.room.currentStep = this.engine.getCurrentStep() || undefined;

    this.addLog(`Đêm ${this.room.nightIndex} bắt đầu. Khởi tạo ${queue.length} lượt gọi ban đêm.`);
    this.broadcast('NIGHT_STARTED', { room: this.room, queue });

    this.dispatchCurrentStep();
  }

  public startNextNightPhase() {
    this.room.nightIndex += 1;
    this.startNightPhase();
  }

  private dispatchCurrentStep() {
    if (this.stepTimer) clearTimeout(this.stepTimer);

    const step = this.engine.getCurrentStep();
    if (!step) {
      this.endNightPhase();
      return;
    }

    this.room.currentStep = step;
    this.addLog(`Lượt gọi #${step.order}: [${step.action.roleName}] thức giấc.`);
    this.broadcast('STEP_CALL_START', { step, timeoutSeconds: step.action.timeoutSeconds });

    // Note: Automatic timeout disabled. Step call queue is controlled explicitly by Game Master / Player actions.
  }

  public sendWakeUpSignal(roleName: string) {
    this.addLog(`Quản trò đã phát tín hiệu chuông rung gọi [${roleName}] thức giấc!`);
    this.broadcast('STEP_WAKE_SIGNAL', { roleName });
  }

  public submitStepAction(playerId: string, actionId: string, targetId: string) {
    if (this.stepTimer) clearTimeout(this.stepTimer);

    const currentStep = this.engine.getCurrentStep();
    if (!currentStep) return;

    this.addLog(`Người chơi ${playerId} đã gửi hành động cho lượt [${currentStep.action.roleName}] -> Mục tiêu ${targetId}.`);
    this.broadcast('STEP_ACTION_SUBMITTED', { playerId, actionId, targetId });

    this.advanceStep();
  }

  private handleStepTimeout(step: StepCallQueueItem) {
    this.addLog(`Lượt [${step.action.roleName}] hết thời gian (${step.action.timeoutPolicy}).`);
    this.broadcast('STEP_TIMEOUT', { step });
    this.advanceStep();
  }

  private advanceStep() {
    const next = this.engine.nextStep();
    if (next) {
      this.dispatchCurrentStep();
    } else {
      this.endNightPhase();
    }
  }

  public endNightPhase() {
    if (this.stepTimer) clearTimeout(this.stepTimer);
    this.room.phase = 'DAY_DISCUSSION';
    this.addLog(`Màn đêm Đêm ${this.room.nightIndex} khép lại. Hướng tới Bình Minh Ngày ${this.room.nightIndex}.`);
    this.broadcast('NIGHT_ENDED', { room: this.room });
  }

  private addLog(message: string) {
    this.room.logs.push(`[${new Date().toLocaleTimeString()}] ${message}`);
  }

  public getEngine(): StepCallEngine {
    return this.engine;
  }

  public getQueue(): StepCallQueueItem[] {
    return this.engine.getQueue();
  }

  public getRoomState(): RoomState {
    return this.room;
  }
}

export const mockServer = new MockStepCallServer();
