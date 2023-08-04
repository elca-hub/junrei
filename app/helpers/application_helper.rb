module ApplicationHelper
  def full_title(page_title = "")
    base = "junrei" # アプリ名
    page_title.present? ? "#{page_title} | #{base}" : base
  end

  def choice_dark_or_light
    start_dark_mode_time = 19
    end_dark_mode_time = 5

    now = Time.now
    if now.hour >= start_dark_mode_time || now.hour <= end_dark_mode_time
      "dark"
    else
      "light"
    end
  end

  def view_time(time)
    time.strftime('%Y/%m/%d/ %H:%M')
  end
end
