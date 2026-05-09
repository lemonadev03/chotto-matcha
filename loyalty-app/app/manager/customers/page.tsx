import { Plus, Search } from "lucide-react";
import { ManagerShell } from "@/components/manager/manager-shell";
import { DataTable } from "@/components/shared/table";
import { SectionTitle } from "@/components/shared/section-title";
import { TierBadge } from "@/components/customer/tier-badge";
import { Button } from "@/components/shared/button";
import { adjustCustomerPoints, setCustomerActive } from "@/app/manager/actions";
import { listCustomersForManager } from "@/lib/data/manager";
import { formatPoints } from "@/lib/formatters";
import { getTier } from "@/lib/loyalty";

export default async function ManagerCustomersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const customers = await listCustomersForManager(q);

  return (
    <ManagerShell>
      <div className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Community" title="Members" />
          <Button href="/manager/customers/new" icon={Plus}>Add customer</Button>
        </div>
        <form className="flex max-w-lg items-center gap-2 rounded-md border border-line bg-cream px-4 py-3">
          <Search className="h-4 w-4 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
          <input name="q" defaultValue={q ?? ""} placeholder="Search name, email, or phone" className="flex-1 bg-transparent text-sm focus:outline-none" />
          <button className="text-sm font-medium text-matcha-deep">Search</button>
        </form>
        <DataTable
          headers={["Name", "Email", "Phone", "Tier", "Leaves", "Status", "Actions"]}
          rows={customers.map((customer) => {
            const tier = getTier(customer.pointsBalance);
            return [
              <span key={`${customer.id}-name`} className="font-medium text-charcoal">
                {customer.name}
              </span>,
              <span key={`${customer.id}-email`} className="text-sm text-ink-muted">
                {customer.email}
              </span>,
              <span key={`${customer.id}-phone`} className="text-sm text-ink-muted">
                {customer.phone}
              </span>,
              <TierBadge key={`${customer.id}-tier`} tier={tier} size="sm" />,
              <span
                key={`${customer.id}-leaves`}
                className="counter text-sm font-medium text-charcoal"
              >
                {formatPoints(customer.pointsBalance)}
              </span>,
              <span key={`${customer.id}-status`} className="text-sm text-ink-muted">
                {customer.active ? "Active" : "Inactive"}
              </span>,
              <div key={`${customer.id}-actions`} className="flex flex-wrap items-center gap-2">
                <Button href={`/manager/customers/${customer.id}/edit`} variant="tertiary">
                  Edit
                </Button>
                <form action={adjustCustomerPoints} className="flex items-center gap-1">
                  <input type="hidden" name="id" value={customer.id} />
                  <input name="pointsDelta" type="number" className="h-9 w-20 rounded-md border border-line bg-cream px-2 text-sm" placeholder="+/-" />
                  <input name="reason" className="h-9 w-36 rounded-md border border-line bg-cream px-2 text-sm" placeholder="Reason" />
                  <button className="h-9 rounded-md border border-line bg-cream px-3 text-xs font-medium text-charcoal">
                    Adjust
                  </button>
                </form>
                <form action={setCustomerActive}>
                  <input type="hidden" name="id" value={customer.id} />
                  <input type="hidden" name="active" value={customer.active ? "false" : "true"} />
                  <button className="h-9 rounded-md border border-line bg-cream px-3 text-xs font-medium text-charcoal">
                    {customer.active ? "Deactivate" : "Reactivate"}
                  </button>
                </form>
              </div>
            ];
          })}
        />
      </div>
    </ManagerShell>
  );
}
