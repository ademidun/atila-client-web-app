export class Transaction {
    hash: string = "";
    destination_amount_number: string|undefined;
    source_address: string = "";
    destination_address: string|undefined;
    network_chain_id: number|undefined;;
    network_name: string|undefined;;
    transaction_fee_hex: string|undefined;;
    withdrawn_amount_hex: string = "";
}