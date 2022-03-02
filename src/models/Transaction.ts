export class Transaction {
    hash: string = "";
    destination_amount_number: number = 0;
    source_address: string = "";
    destination_address: string = "";
    network_chain_id: string|number = "";
    network_name: string = "";
    transaction_fee_hex: string = "";
    withdrawn_amount_hex: string = "";
}