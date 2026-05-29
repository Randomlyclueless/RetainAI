class MonitoringAgent:

    def monitor(self, analytics):

        alerts = []

        if analytics["churnRate"] > 40:

            alerts.append(
                "High churn rate detected"
            )

        return {
            "alerts": alerts
        }