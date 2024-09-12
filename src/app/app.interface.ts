export interface Data {
  orderNo: number;
  shipmentTrackingNo: string;
  orderTrackingNo: string;
  customerName: string;
  district: string;
  plate: string;
  Status: number;
  releasedForDistribution: string;
  Date: string;
}

export default interface Response {
  header: {
    packetRoute: number;
    DMPackageCount: number;
    packageReleased: number;
    delivered: number;
    notDelivered: number;
    completedOrder: string;
  };
  dataTable: Data[]
}
