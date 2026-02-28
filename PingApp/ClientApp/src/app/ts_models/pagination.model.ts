import { IShipStatusDto } from '../services/api/pingapp-api.service';


export interface IPaginatedViewModel {
  ships: IShipStatusDto[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  sort: string;
  direction: string;
}
