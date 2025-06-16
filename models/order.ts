import ITicket from '@/models/ticket';

export interface IOrder {
  tickets: ITicket[],
  subtotal: number,
  tax: number,
  total: number,
  paymentMethod: string,
  status: string,
  trackingNumber: string,
}
