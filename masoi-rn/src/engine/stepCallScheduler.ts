/**
 * Step Call Scheduler & Role Lifecycle Execution Manager
 */

import { StepCallEngine, PlayerState, StepCallQueueItem } from './stepCallEngine';
import { CardSet, RoleLifecycle } from './stepCallSchema';

export interface ActionPayload {
  actionId: string;
  actorId: string;
  targetId?: string;
  extraData?: any;
}

export class StepCallScheduler {
  private engine: StepCallEngine;
  private players: PlayerState[];
  private activeCardSets: CardSet[];
  private currentNight: number;

  constructor(cardSets: CardSet[] = ['BASIC', 'CHARACTER']) {
    this.activeCardSets = cardSets;
    this.engine = new StepCallEngine(cardSets);
    this.players = [];
    this.currentNight = 1;
  }

  public initGame(players: PlayerState[], cardSets: CardSet[] = ['BASIC', 'CHARACTER']) {
    this.players = players;
    this.activeCardSets = cardSets;
    this.currentNight = 1;
    this.engine = new StepCallEngine(cardSets);
  }

  public startNight(nightIndex: number = 1): StepCallQueueItem[] {
    this.currentNight = nightIndex;
    return this.engine.buildNightQueue(this.players, nightIndex);
  }

  public processAction(payload: ActionPayload): { success: boolean; nextStep: StepCallQueueItem | null; resultNotice?: string } {
    const currentStep = this.engine.getCurrentStep();
    if (!currentStep) {
      return { success: false, nextStep: null, resultNotice: 'Không có lượt gọi ban đêm đang hoạt động.' };
    }

    let notice = '';
    switch (payload.actionId) {
      case 'seer_inspect':
        notice = `Tiên Tri đã soi người chơi ${payload.targetId}.`;
        break;
      case 'werewolves_attack':
        notice = `Phe Sói đã chốt cắn nạn nhân ${payload.targetId}.`;
        break;
      case 'witch_action':
        notice = `Phù Thủy đã quyết định tác động bình thuốc.`;
        break;
      case 'cupid_bind':
        notice = `Cupid đã se duyên cho 2 người chơi.`;
        break;
      case 'defender_protect':
        notice = `Bảo Vệ đã dựng khiên che chở người chơi ${payload.targetId}.`;
        break;
      default:
        notice = `Đã hoàn tất hành động [${currentStep.action.roleName}].`;
    }

    const next = this.engine.nextStep();
    return { success: true, nextStep: next, resultNotice: notice };
  }

  public handleDeathEvent(deadPlayerId: string): { triggeredActions: string[] } {
    const deadPlayer = this.players.find((p) => p.id === deadPlayerId);
    if (deadPlayer) {
      deadPlayer.isAlive = false;
    }

    const triggeredActions: string[] = [];
    if (deadPlayer?.roleId === 'hunter') {
      triggeredActions.push('hunter_shoot');
    }
    if (deadPlayer?.roleId === 'wolf_cub') {
      triggeredActions.push('wolf_cub_rage');
    }

    return { triggeredActions };
  }
}
