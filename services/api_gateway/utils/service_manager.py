import yaml

class ServiceManager:
    def __init__(self, config_path):
        self.config_path = config_path
        self.services = self.load_services()

    def load_services(self):
        with open(self.config_path, 'r') as f:
            config = yaml.safe_load(f)
        return config.get('services', [])

    def get_service_url(self, service_name):
        for service in self.services:
            if service['name'] == service_name:
                return service['url']
        return None