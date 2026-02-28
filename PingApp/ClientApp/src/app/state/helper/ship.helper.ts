type IShipDto = { id: string; name: string; hostAddr: string };
type IShipStatusDto = IShipDto & { result: string };
export type ShipStatusPatch = Partial<IShipStatusDto> & { id: string };
const hasText = (v?: string) => !!v && v.trim().length > 0;

export function mergePagedIntoStatus(
  incoming: IShipDto,
  existing?: IShipStatusDto
): IShipStatusDto {
  return {
    id: incoming.id,
    name: incoming.name,
    hostAddr: incoming.hostAddr,
    result: existing?.result ?? 'Unknown',
  };
}

// export function mergeSocketIntoEntity(
//   incoming: ShipStatusPatch,
//   existing?: IShipStatusDto
// ): IShipStatusDto {
//   return {
//     id: incoming.id,
//     name: incoming.name ?? existing?.name ?? '',
//     hostAddr: incoming.hostAddr ?? existing?.hostAddr ?? '',
//     result: incoming.result ?? existing?.result ?? 'Unknown',
//   };
// }
//
// export function mergeSocketStatusOnly(
//   incoming: ShipStatusPatch,
//   existing?: IShipStatusDto
// ): IShipStatusDto {
//   return {
//     id: incoming.id,
//     name: existing?.name ?? '',
//     hostAddr: existing?.hostAddr ?? '',
//     result: incoming.result ?? existing?.result ?? 'Unknown',
//   };
// }

export function mergeSocketFillEmptyStatics(
  incoming: ShipStatusPatch,
  existing?: IShipStatusDto
): IShipStatusDto {
  return {
    id: incoming.id,

    // ✅ fill static fields only if we don't already have them
    name: hasText(existing?.name) ? existing!.name : (incoming.name ?? existing?.name ?? ''),
    hostAddr: hasText(existing?.hostAddr) ? existing!.hostAddr : (incoming.hostAddr ?? existing?.hostAddr ?? ''),

    // ✅ socket remains authoritative for status
    result: incoming.result ?? existing?.result ?? 'Unknown',
  };
}
