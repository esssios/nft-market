import ABI from '../abis/FUSDT.json';
import { createContract } from './common';

export async function fustdOperationFunc() {
  const contract = await createContract(import.meta.env.VITE_FUSTD_ADDRESS, ABI);

  async function approve(spender: string, amount: string) {
    if (!contract) return;
    const result = await contract.approve(spender, amount);
    console.log(result.hash);
  }

  async function getAllowance(owner: string, spender: string): Promise<number> {
    if (!contract) return 0;
    const result = await contract.allowance(owner, spender);
    return Number(result);
  }

  return {
    approve,
    getAllowance,
  };
}