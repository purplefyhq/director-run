import { Card, CardDescription, CardHeader, CardTitle } from "@workingco/design/components/card";
import { Ornament, OrnamentFallback } from "@workingco/design/components/ornament";
import { PillGroup } from "@workingco/design/components/pill";
import { Pill } from "@workingco/design/components/pill";
import { BugIcon, SparklesIcon } from "@workingco/icons";
import { AsteriskIcon } from "@workingco/icons";
import { CalculationIcon } from "@workingco/icons";
import Link from "next/link";

export function ExtensionCard() {
  return (
    <Card interactive asChild>
      <Link href="/extensions/sentry">
        <div className="flex flex-col gap-y-3">
          <Ornament>
            <OrnamentFallback>
              <BugIcon />
            </OrnamentFallback>
          </Ornament>
          <CardHeader>
            <CardTitle>Sentry</CardTitle>
            <CardDescription>Sentry is a tool for monitoring and analyzing errors in your code.</CardDescription>
          </CardHeader>
        </div>

        <PillGroup>
          <Pill variant="secondary" size="md">
            <SparklesIcon />
            <span>12 prompts</span>
          </Pill>
          <Pill variant="secondary" size="md">
            <AsteriskIcon />
            <span>3 resources</span>
          </Pill>
          <Pill variant="secondary" size="md">
            <CalculationIcon />
            <span>12,000 tools</span>
          </Pill>
        </PillGroup>
      </Link>
    </Card>
  );
}
