module ApplicationHelper
  def full_title(page_title = "")
    base = "junrei" # アプリ名
    return page_title.present? ? "#{page_title} | #{base}" : base
  end
end
