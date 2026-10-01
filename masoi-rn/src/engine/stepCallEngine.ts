/**
 * Step Call Engine - Queue Dispatcher & State Machine Controller
 */

import {
  CardSet,
  ActionDefinition,
  ACTION_CATALOG,
  StepCallState,
} from './stepCallSchema';

export interface PlayerState {
  id: string;
  seatNum: string;
  roleId: string;
  isAlive: boolean;
  hasUsedAbility?: boolean;
}

export interface StepCallQueueItem {
  order: number;
  action: ActionDefinition;
  assignedPlayerId?: string;
  isCompleted: boolean;
}

export class StepCallEngine {
  private activeCardSets: CardSet[];
  private currentNightIndex: number;
  private queue: StepCallQueueItem[];
  private currentStepIndex: number;
  private currentState: StepCallState;

  constructor(cardSets: CardSet[] = ['BASIC', 'CHARACTER']) {
    this.activeCardSets = cardSets;
    this.currentNightIndex = 1;
    this.queue = [];
    this.currentStepIndex = -1;
    this.currentState = 'IDLE';
  }

  /**
   * Builds the night queue dynamically based on active card sets, living players, and night index
   */
  public buildNightQueue(
    players: PlayerState[],
    nightIndex: number = 1
  ): StepCallQueueItem[] {
    this.currentNightIndex = nightIndex;
    const isFirstNight = nightIndex === 1;

    const availableActions: ActionDefinition[] = Object.values(ACTION_CATALOG).filter(
      (action) => {
        // Filter by active card sets
        if (!this.activeCardSets.includes(action.cardSet)) {
          return false;
        }

        // Filter by First Night vs Normal Night lifecycle
        if (isFirstNight) {
          if (action.turnOrderFirstNight < 0) return false;
        } else {
          if (action.lifecycle === 'FIRST_NIGHT_ONLY') return false;
          if (action.turnOrderNormalNight < 0) return false;
        }

        // Check if there is an active living player holding this role
        if (action.roleId === 'werewolf') {
          return players.some((p) => p.roleId === 'werewolf' && p.isAlive);
        }

        const roleHolder = players.find((p) => p.roleId === action.roleId && p.isAlive);
        return !!roleHolder;
      }
    );

    // Sort by priority order
    availableActions.sort((a, b) => {
      const orderA = isFirstNight ? a.turnOrderFirstNight : a.turnOrderNormalNight;
      const orderB = isFirstNight ? b.turnOrderFirstNight : b.turnOrderNormalNight;
      return orderA - orderB;
    });

    // Map into Queue Items
    this.queue = availableActions.map((action, index) => {
      const roleHolder = players.find((p) => p.roleId === action.roleId && p.isAlive);
      return {
        order: index + 1,
        action,
        assignedPlayerId: roleHolder ? roleHolder.id : undefined,
        isCompleted: false,
      };
    });

    this.currentStepIndex = 0;
    this.currentState = 'ROLE_TURN_START';
    return this.queue;
  }

  public getQueue(): StepCallQueueItem[] {
    return this.queue;
  }

  public getCurrentStep(): StepCallQueueItem | null {
    if (this.currentStepIndex >= 0 && this.currentStepIndex < this.queue.length) {
      return this.queue[this.currentStepIndex];
    }
    return null;
  }

  public nextStep(): StepCallQueueItem | null {
    if (this.currentStepIndex >= 0 && this.currentStepIndex < this.queue.length) {
      this.queue[this.currentStepIndex].isCompleted = true;
    }

    this.currentStepIndex += 1;
    if (this.currentStepIndex < this.queue.length) {
      this.currentState = 'ROLE_TURN_START';
      return this.queue[this.currentStepIndex];
    } else {
      this.currentState = 'IDLE';
      return null;
    }
  }

  public getCurrentState(): StepCallState {
    return this.currentState;
  }
}
