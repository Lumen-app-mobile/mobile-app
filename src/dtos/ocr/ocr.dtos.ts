export interface OcrProductDto {
  name: string;
  price: number;
  quantity: number;
  shop_name: string;
}

export interface OcrResponseDto {
  company: string;
  amount: number;
  date: string;
  description: string;
  products: OcrProductDto[];
  success: boolean;
  error: string;
}
