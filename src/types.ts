/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ElectionStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  details: string[];
  color: string;
  startDay: number;
  endDay: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type ViewState = 'landing' | 'journey' | 'assistant' | 'polling-stations';
