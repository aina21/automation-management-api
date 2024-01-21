export class DeleteAutomationDto {
  id: string;
  message: string;
  status: number;
}

export class UpdateAutomationDto {
  id: string;
  criticalRatio: number;
  message: string;
  status: number;
}
