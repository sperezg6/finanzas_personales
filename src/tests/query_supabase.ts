import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();



// Type for our transaction
interface Transaction {
    id: number;
    description: string;
    amount: number;
    transaction_date: string;
    category_id: number;
    account_id: number;
  }

async function fetchTransactions() {
    // Create Supabase client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Connecting to Supabase...');

    // Fetch transactions from the database
    try{

        // Simple query to get all transactions
        console.log('Querying all transactions:');
        const { data: allTransactions, error: allError } = await supabase
        .from('transactions')
        .select('*');

        if (allError) throw allError;
        console.log(`Found ${allTransactions?.length || 0} transactions`);
        console.log(allTransactions);

    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
    

}

fetchTransactions().catch(console.error);
