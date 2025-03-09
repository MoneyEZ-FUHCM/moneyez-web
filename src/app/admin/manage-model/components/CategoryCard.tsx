import { renderIcon } from "@/components/common/IconRender";
import { CategoryCardProps } from "@/types/spendingModel.types";
import { Card, List, Progress, Typography, Tag } from "antd";

const { Title, Text } = Typography;

const CategoryCard = ({ category, percentageAmount }: CategoryCardProps) => {
  return (
    <Card className="h-full shadow-md transition-shadow hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-center">
          <Progress
            type="circle"
            percent={percentageAmount}
            format={(percent) => `${percent}%`}
            size={80}
          />
        </div>
        <div className="flex flex-col items-end gap-2">
          <Tag color={category.type === 'INCOME' ? 'green' : 'red'}>
            {category.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}
          </Tag>
          {category?.icon && (
            <div className="text-2xl">{renderIcon(category.icon)}</div>
          )}
        </div>
      </div>

      <Title level={4} className="mb-4 text-center">
        {category?.name}
      </Title>

      <Text className="mb-4 block text-gray-600">{category?.description}</Text>

      {(category?.subcategories ?? []).length > 0 && (
        <div className="max-h-[200px] overflow-y-auto">
          <List
            size="small"
            dataSource={category.subcategories ?? []}
            renderItem={(item) => (
              <List.Item className="py-1">
                <span className="flex items-center">
                  {renderIcon(item.icon, 20)}
                  <span className="ml-2">{item.name}</span>
                </span>
              </List.Item>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export { CategoryCard };
